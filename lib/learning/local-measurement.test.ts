import { it, expect } from "vitest";
import { localReturnWindow, type LocalMeasurement } from "./local-measurement";
it("reports immature return windows as unknown rather than improved retention", () => {
 const data: LocalMeasurement = {version:1,firstVisit:"2026-10-01",visits:["2026-10-01","2026-10-02"],meaningfulDays:["2026-10-02"],started:1,completed:1,abandoned:0,delayedRevisits:0,desire:{yes:0,later:0},placement:"lkg",language:"hi",device:"phone"};
 expect(localReturnWindow(data,1)).toBe(true); expect(localReturnWindow(data,7)).toBeNull(); expect(localReturnWindow(data,30)).toBeNull();
});
