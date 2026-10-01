import { beforeEach, describe, expect, it, vi } from "vitest";

const m = vi.hoisted(() => ({ auth: vi.fn(), currentUser: vi.fn(), linked: vi.fn(), authority: vi.fn(), clear: vi.fn(), upsert: vi.fn() }));
vi.mock("@clerk/nextjs/server", () => ({ auth: m.auth, currentUser: m.currentUser }));
vi.mock("./clerk-config", () => ({ clerkConfigured: true }));
vi.mock("../db/client", () => ({ dbConfigured: () => true }));
vi.mock("../db/account-links", () => ({ accountAuthority: m.authority }));
vi.mock("../db/queries", () => ({
  getLearnerForClerkUser: m.linked, clearSelfLink: m.clear, upsertParent: m.upsert,
  resolveDeviceToken: vi.fn(), disabledCapabilitiesForTokens: vi.fn(),
}));
import { resolveIdentity, requireParent } from "./session";

beforeEach(() => {
  vi.resetAllMocks();
  m.auth.mockResolvedValue({ userId: "signed-account" });
  m.currentUser.mockResolvedValue({ publicMetadata: {}, primaryEmailAddress: { emailAddress: "a@example.test" } });
  m.linked.mockResolvedValue(null);
  m.authority.mockResolvedValue(null);
});

describe("authentication versus guardian authority", () => {
  it("never auto-enrolls unknown signed-in accounts", async () => {
    expect(await resolveIdentity()).toEqual({ kind: "anonymous", reason: "unlinked" });
    expect(m.upsert).not.toHaveBeenCalled();
  });
  it("does not accept parent metadata as authority", async () => {
    m.currentUser.mockResolvedValue({ publicMetadata: { role: "parent" } });
    expect(await requireParent()).toBeNull();
  });
  it("preserves existing database parent accounts", async () => {
    m.authority.mockResolvedValue("parent");
    expect(await requireParent()).toMatchObject({ kind: "parent", userId: "signed-account" });
  });
  it("linked learners cannot enter parent routes", async () => {
    m.linked.mockResolvedValue({ id: "learner", parentId: "different-account", verificationLevel: 2 });
    expect(await requireParent()).toBeNull();
    expect(await resolveIdentity()).toMatchObject({ kind: "learner", verificationLevel: 2 });
  });
  it.each(["learner", "revoked"])("retains %s classification after unlink", async (authority) => {
    m.authority.mockResolvedValue(authority);
    expect(await requireParent()).toBeNull();
    expect(await resolveIdentity()).toEqual({ kind: "anonymous", reason: authority === "revoked" ? "revoked" : "unlinked" });
  });
  it("preserves historical self-link repair for an existing parent", async () => {
    m.linked.mockResolvedValue({ parentId: "signed-account" });
    m.authority.mockResolvedValue("parent");
    expect(await requireParent()).toMatchObject({ kind: "parent" });
    expect(m.clear).toHaveBeenCalledWith("signed-account");
  });
  it("self-link repair alone cannot enroll a parent", async () => {
    m.linked.mockResolvedValue({ parentId: "signed-account" });
    expect(await requireParent()).toBeNull();
  });
  it("preserves explicit learner denial even for a legacy parent row", async () => {
    m.authority.mockResolvedValue("parent");
    m.currentUser.mockResolvedValue({ publicMetadata: { role: "learner" } });
    expect(await requireParent()).toBeNull();
  });
});
