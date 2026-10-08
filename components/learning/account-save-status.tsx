"use client";

import { CircleCheck, CloudOff, CloudUpload, TriangleAlert, Link2 } from "lucide-react";
import type { SyncState } from "@/lib/sync/client";
import { InfoPopover } from "@/components/ui/info-popover";

const messages = {
  en: {
    idle: ["Link account", "Connect an account"],
    syncing: ["Saving", "Saving to your account…"],
    synced: ["Saved", "Saved to your account"],
    offline: ["Offline", "Offline: saved on this device, waiting to sync"],
    error: ["Not saved", "Account save unavailable. Check connection or reconnect"],
  },
  hi: {
    idle: ["खाता जोड़ें", "खाता जोड़ें"],
    syncing: ["सहेज रहे हैं", "खाते में सहेज रहे हैं…"],
    synced: ["सहेजा", "खाते में सहेजा"],
    offline: ["ऑफ़लाइन", "ऑफ़लाइन: इस डिवाइस पर सहेजा, इंटरनेट पर सिंक होगा"],
    error: ["नहीं सहेजा", "खाते में नहीं सहेजा: फिर जोड़ें या इंटरनेट जाँचें"],
  },
} as const;
const icons = { idle: Link2, syncing: CloudUpload, synced: CircleCheck, offline: CloudOff, error: TriangleAlert };

export function AccountSaveStatus({ status, language = "en" }: { status: SyncState; language?: "en" | "hi" }) {
  const [short, description] = messages[language][status];
  const Icon = icons[status];
  return <div className="account-save-status" data-save-state={status}>
    <span className="sr-only" role="status" aria-atomic="true">{description}</span>
    <InfoPopover label={description} summary={<><span key={status} className="state-icon"><Icon size={20} aria-hidden="true" /></span><span>{short}</span></>}>
      <p>{description}</p>
    </InfoPopover>
  </div>;
}
