import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ parent: vi.fn(), rate: vi.fn(), mutate: vi.fn(), origin: vi.fn() }));
vi.mock("@/lib/auth/session", () => ({ requireParent: mocks.parent }));
vi.mock("@/lib/auth/reverification", () => ({ requireRecentParentReverification: async () => null }));
vi.mock("@/lib/db/client", () => ({ dbConfigured: () => true }));
vi.mock("@/lib/api/guard", async (original) => ({ ...await original<typeof import("./guard")>(), rateLimit: mocks.rate, isSameOrigin: mocks.origin }));
vi.mock("@/lib/db/queries", () => ({
  listDevicesForParent: vi.fn(), revokeDeviceForParent: mocks.mutate,
  setDisabledCapabilities: mocks.mutate, safetySignalsForParent: vi.fn(), markSafetySignalsSeen: mocks.mutate,
  issueClaimCode: mocks.mutate, listLearnersForParent: vi.fn(), createLearner: mocks.mutate,
  getLearnerForParent: async (_parent: string, id: string) => ({ id }),
}));
vi.mock("@/lib/db/ai-tutor-policies", () => ({
  pauseAllLearnerAiAssignmentsForParent: mocks.mutate, deleteAiTutorProfileForParent: mocks.mutate,
  getLearnerAiAssignmentForParent: vi.fn(), removeLearnerAiAssignmentForParent: mocks.mutate, setLearnerAiAssignmentForParent: mocks.mutate,
}));
vi.mock("@/lib/db/ai-connections", () => ({
  deleteAiConnectionForParent: mocks.mutate, getAiConnectionForParent: vi.fn(), replaceAiConnectionCredentialForParent: vi.fn(),
}));
import { DELETE as devices } from "@/app/api/parent/learners/[id]/devices/route";
import { PATCH as capabilities } from "@/app/api/parent/learners/[id]/capabilities/route";
import { PATCH as safety } from "@/app/api/parent/learners/[id]/safety/route";
import { POST as claim } from "@/app/api/parent/learners/[id]/claim-code/route";
import { POST as create } from "@/app/api/parent/learners/route";
import { POST as pause } from "@/app/api/parent/ai-tutors/pause-all/route";
import { DELETE as profile } from "@/app/api/parent/ai-tutors/[id]/route";
import { DELETE as connection } from "@/app/api/parent/ai-connections/[id]/route";
import { DELETE as assignment } from "@/app/api/parent/learners/[id]/ai-tutor/route";

const operations = [
  { name: "devices", handler: devices, method: "DELETE", body: { deviceId: "all" } },
  { name: "caps", handler: capabilities, method: "PATCH", body: { disabled: ["ai.tutor.full"] } },
  { name: "safety", handler: safety, method: "PATCH", body: {} },
  { name: "claim-code", handler: claim, method: "POST", body: {} },
  { name: "parent-learners", handler: create, method: "POST", body: { name: "Learner", grade: 5, board: "cambridge-primary" } },
  { name: "parent-ai-pause-all", handler: pause, method: "POST", body: {} },
  { name: "parent-ai-tutor-delete", handler: profile, method: "DELETE", body: {} },
  { name: "parent-ai-connection-delete", handler: connection, method: "DELETE", body: {} },
  { name: "parent-learner-ai-delete", handler: assignment, method: "DELETE", body: {} },
];
const id = "11111111-1111-4111-8111-111111111111";
const allowed = { ok: true, remaining: 1, resetAt: 60000, retryAfterSeconds: 0 };
function request(operation: typeof operations[number], ip = "203.0.113.10") {
  return new Request("https://vidya.example/api/parent/action", {
    method: operation.method, headers: { "content-type": "application/json", origin: "https://vidya.example", "x-forwarded-for": ip },
    body: JSON.stringify(operation.body),
  });
}
beforeEach(() => {
  vi.resetAllMocks();
  mocks.origin.mockReturnValue(true);
  mocks.parent.mockResolvedValue({ userId: "parent-a" });
  mocks.rate.mockResolvedValue(allowed);
  mocks.mutate.mockResolvedValue({ revoked: 1, disabledCapabilities: [] });
});

describe.each(operations)("parent mutation quota: $name", (operation) => {
  const invoke = (ip?: string) => operation.handler(request(operation, ip), { params: Promise.resolve({ id }) });
  it("rejects unauthenticated callers without consuming the parent's quota", async () => {
    mocks.parent.mockResolvedValue(null);
    for (let attempt = 0; attempt < 3; attempt++) expect((await invoke()).status).toBe(401);
    expect(mocks.rate).not.toHaveBeenCalled();
    expect(mocks.mutate).not.toHaveBeenCalled();
  });
  it("isolates parents sharing a NAT and keeps one parent's quota across IP changes", async () => {
    mocks.rate.mockImplementation(async (key: string) => key === `${operation.name}:parent-a`
      ? { ok: false, remaining: 0, resetAt: 60000, retryAfterSeconds: 60 } : allowed);
    const denied = await invoke();
    expect(denied.status).toBe(429);
    expect(denied.headers.get("retry-after")).toBe("60");
    expect(mocks.mutate).not.toHaveBeenCalled();
    expect((await invoke("203.0.113.99")).status).toBe(429);
    mocks.parent.mockResolvedValue({ userId: "parent-b" });
    expect((await invoke()).status).toBeLessThan(300);
    expect(mocks.rate.mock.calls.map(([key]) => key)).toEqual([
      `${operation.name}:parent-a`, `${operation.name}:parent-a`, `${operation.name}:parent-b`,
    ]);
    expect(mocks.mutate).toHaveBeenCalledTimes(1);
    expect(mocks.mutate.mock.calls[0][0]).toEqual(operation.name === "parent-learners" ? expect.objectContaining({ parentId: "parent-b" }) : "parent-b");
  });
  it("preserves same-origin checks and fails closed on unavailable quota storage", async () => {
    mocks.origin.mockReturnValueOnce(false);
    expect((await invoke()).status).toBe(403);
    expect(mocks.parent).not.toHaveBeenCalled();
    expect(mocks.rate).not.toHaveBeenCalled();
    mocks.rate.mockResolvedValue({ ok: false, unavailable: true, retryAfterSeconds: 5 });
    const response = await invoke();
    expect(response.status).toBe(503);
    expect(response.headers.get("retry-after")).toBe("5");
    expect(mocks.mutate).not.toHaveBeenCalled();
  });
});
