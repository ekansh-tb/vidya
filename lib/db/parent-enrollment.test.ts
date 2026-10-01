import { expect, it, vi } from "vitest";
const sql = vi.hoisted(() => vi.fn());
vi.mock("./client", () => ({ getSql: () => sql }));
import { enrollParent } from "./parent-enrollment";
import { PARENT_ACKNOWLEDGEMENT_TEXT, PARENT_ACKNOWLEDGEMENT_VERSION } from "../auth/parent-enrollment-contract";
it("writes the server-owned acknowledgement text and version atomically with identity", async () => {
  sql.mockResolvedValue([{ ok: true }]);
  expect(await enrollParent({ userId: "adult", email: "a@example.test", emailId: "email", displayName: null, sessionId: "session" })).toBe(true);
  expect(sql.mock.calls[0].slice(1)).toEqual(["adult", "a@example.test", null, "email", "session", PARENT_ACKNOWLEDGEMENT_VERSION, PARENT_ACKNOWLEDGEMENT_TEXT]);
});
