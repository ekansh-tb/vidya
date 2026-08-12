// The httpOnly device cookie exists to close one specific hole: the
// `x-vidya-device` header is volunteered by the client, and the client is
// exactly who a parent's switch-off is aimed at. A child could delete
// `deviceToken` from the Vidya localStorage blob, resolve as anonymous, skip
// the check against them, and have the denial degrade to `below_min_rung` —
// which the tutor's observe mode logs and allows.
//
// These tests pin the parsing and the cookie attributes. The deny-only rule
// itself is enforced in resolveCapabilityForRequest and covered in server.test.

import { describe, it, expect } from "vitest";
import {
  parseDeviceCookie, buildDeviceCookie, DEVICE_COOKIE, MAX_COOKIE_DEVICES,
} from "./session";

describe("parseDeviceCookie", () => {
  it("finds the token among other cookies", () => {
    const jar = `theme=dark; ${DEVICE_COOKIE}=abc123; __session=xyz`;
    expect(parseDeviceCookie(jar)).toEqual(["abc123"]);
  });

  it("returns nothing for an absent or empty jar", () => {
    expect(parseDeviceCookie(null)).toEqual([]);
    expect(parseDeviceCookie("")).toEqual([]);
    expect(parseDeviceCookie("theme=dark")).toEqual([]);
  });

  it("does not match a cookie whose name merely contains ours", () => {
    // `not_vidya_devices=` must not be read as our cookie.
    expect(parseDeviceCookie(`not_${DEVICE_COOKIE}=sneaky`)).toEqual([]);
  });

  it("reads several devices from one browser", () => {
    expect(parseDeviceCookie(`${DEVICE_COOKIE}=a,b,c`)).toEqual(["a", "b", "c"]);
  });

  it("survives a malformed value rather than throwing", () => {
    expect(parseDeviceCookie(`${DEVICE_COOKIE}=`)).toEqual([]);
    expect(parseDeviceCookie(`${DEVICE_COOKIE}=,,,`)).toEqual([]);
  });

  it("caps how many it will read", () => {
    const many = Array.from({ length: 20 }, (_, i) => `t${i}`).join(",");
    expect(parseDeviceCookie(`${DEVICE_COOKIE}=${many}`)).toHaveLength(MAX_COOKIE_DEVICES);
  });
});

describe("buildDeviceCookie", () => {
  it("is httpOnly, so a localStorage edit cannot reach it", () => {
    // The whole point. If this attribute goes, the hole reopens.
    expect(buildDeviceCookie(null, "tok")).toContain("HttpOnly");
  });

  it("is SameSite=Lax and path-wide", () => {
    const c = buildDeviceCookie(null, "tok");
    expect(c).toContain("SameSite=Lax");
    expect(c).toContain("Path=/");
  });

  it("keeps siblings' devices instead of evicting them", () => {
    // Two kids on one iPad both link. Losing the first would mean the first
    // child's switch-off stopped being enforced the moment the second linked.
    const first = buildDeviceCookie(null, "kid-a");
    const second = buildDeviceCookie(`${DEVICE_COOKIE}=kid-a`, "kid-b");
    expect(first).toContain("kid-a");
    expect(parseDeviceCookie(second.split(";")[0]!)).toEqual(["kid-b", "kid-a"]);
  });

  it("does not accumulate duplicates when a device re-links", () => {
    const c = buildDeviceCookie(`${DEVICE_COOKIE}=kid-a,kid-b`, "kid-a");
    expect(parseDeviceCookie(c.split(";")[0]!)).toEqual(["kid-a", "kid-b"]);
  });

  it("caps the list so a shared device cannot grow the header forever", () => {
    let jar = "";
    for (let i = 0; i < 12; i++) jar = buildDeviceCookie(jar, `tok-${i}`).split(";")[0]!;
    expect(parseDeviceCookie(jar)).toHaveLength(MAX_COOKIE_DEVICES);
    // Newest wins the cap.
    expect(parseDeviceCookie(jar)[0]).toBe("tok-11");
  });
});
