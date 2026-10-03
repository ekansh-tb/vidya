import { expect, it } from "vitest";
import { canSync } from "./client";
import type { LearnerProfile } from "../types";
it("legacy local records and claimed records without a device credential cannot open account learning",()=>{
  const profile={id:"legacy",remoteId:"owned",verifiedLevel:2} as LearnerProfile;
  expect(canSync(profile)).toBe(false);
  expect(canSync({...profile,deviceToken:"revocable-device"})).toBe(true);
  expect(canSync({...profile,deviceToken:"revocable-device",verifiedLevel:0})).toBe(false);
  expect(canSync({...profile,remoteId:undefined,deviceToken:"revocable-device"})).toBe(false);
});
