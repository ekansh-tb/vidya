import { afterEach, describe, expect, it, vi } from "vitest";
import { notificationPermissionFromGesture } from "./browser-permission";

afterEach(() => vi.useRealTimers());
describe("unanswered browser notification permissions", () => {
  it("calls permission inside the gesture and returns the browser decision", async () => {
    const request = vi.fn(() => Promise.resolve("denied" as const));
    const result = notificationPermissionFromGesture(request);
    expect(request).toHaveBeenCalledOnce();
    expect(await result).toBe("denied");
  });
  it("releases an unanswered prompt without continuing after a late grant", async () => {
    vi.useFakeTimers();
    let answer!: (value: NotificationPermission) => void;
    const proceed = vi.fn();
    const result = notificationPermissionFromGesture(() => new Promise(resolve => { answer = resolve; })).then(proceed);
    const failure = expect(result).rejects.toThrow("You can keep using Vidya");
    await vi.advanceTimersByTimeAsync(20_000);
    await failure;
    answer("granted");
    await Promise.resolve();
    expect(proceed).not.toHaveBeenCalled();
  });
  it("clears the deadline after an immediate grant", async () => {
    vi.useFakeTimers();
    expect(await notificationPermissionFromGesture(() => Promise.resolve("granted"))).toBe("granted");
    expect(vi.getTimerCount()).toBe(0);
  });
});
