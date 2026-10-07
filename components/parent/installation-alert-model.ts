export const INSTALLATION_REMINDER_KEY="vidya-parent-installation-dismissed-v1";
export const INSTALLATION_SESSION_KEY="vidya-parent-installation-session-v1";
export const INSTALLATION_COOLDOWN_MS=7*24*60*60*1000;
export function shouldShowInstallationAlert(installed:boolean,sessionDismissed:boolean,lastDismissed:string|null,now:number):boolean {
 if(installed||sessionDismissed)return false;
 if(lastDismissed===null)return true;
 const previous=Number(lastDismissed);
 return !Number.isFinite(previous)||previous<=0||previous>now||now-previous>=INSTALLATION_COOLDOWN_MS;
}
