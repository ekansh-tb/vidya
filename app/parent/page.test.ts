import { beforeEach, expect, it, vi } from "vitest";
const m = vi.hoisted(() => ({ parent: vi.fn(), dashboard: vi.fn(() => null), redirect: vi.fn() }));
vi.mock("@/lib/auth/session", () => ({ requireParent: m.parent }));
vi.mock("./dashboard", () => ({ ParentDashboard: m.dashboard }));
vi.mock("next/navigation", () => ({ redirect: m.redirect }));
import Page from "./page";
beforeEach(() => {
  vi.resetAllMocks();
  m.redirect.mockImplementation(() => { throw new Error("redirect"); });
});
it("redirects non-parent accounts before rendering any local dashboard", async () => {
  m.parent.mockResolvedValue(null);
  await expect(Page()).rejects.toThrow("redirect");
  expect(m.redirect).toHaveBeenCalledWith("/parent/enroll");
  expect(m.dashboard).not.toHaveBeenCalled();
});
it("renders the dashboard only for server-authorized parents", async () => {
  m.parent.mockResolvedValue({ kind: "parent", userId: "owner" });
  expect((await Page()).type).toBe(m.dashboard);
  expect(m.redirect).not.toHaveBeenCalled();
});
