import { describe,it,expect } from "vitest";
import { shouldShowInstallationAlert,INSTALLATION_COOLDOWN_MS } from "./installation-alert-model";
describe("nonblocking local installation reminder",()=>{
 const now=1800000000000;
 it("shows for a browser visitor without creating a permission or installation",()=>expect(shouldShowInstallationAlert(false,false,null,now)).toBe(true));
 it("hides for standalone apps and the dismissed session",()=>{expect(shouldShowInstallationAlert(true,false,null,now)).toBe(false);expect(shouldShowInstallationAlert(false,true,null,now)).toBe(false);});
 it("respects a week cooldown and then allows another reminder",()=>{expect(shouldShowInstallationAlert(false,false,String(now-1000),now)).toBe(false);expect(shouldShowInstallationAlert(false,false,String(now-INSTALLATION_COOLDOWN_MS),now)).toBe(true);});
 it("does not let invalid or future local storage suppress it forever",()=>{for(const value of ["invalid","0",String(now+1000)])expect(shouldShowInstallationAlert(false,false,value,now)).toBe(true);});
});
