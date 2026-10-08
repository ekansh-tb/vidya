"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import { parseParentAppearance, type ParentAppearance } from "@/components/parent/parent-experience-model";
import "../family-dashboard.css";

export function ParentEntryShell({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const accountId = user?.id ?? null;
  const [preference, setPreference] = useState<{ accountId: string | null; value: ParentAppearance }>({ accountId: null, value: "light" });
  const appearance = preference.accountId === accountId ? preference.value : "light";
  useEffect(() => {
    let value: ParentAppearance = "light";
    try { if (accountId) value = parseParentAppearance(localStorage.getItem(`vidya:parent:appearance:v1:${accountId}`)); } catch { /* Preferences are optional. */ }
    setPreference({ accountId, value });
  }, [accountId]);
  function choose(value: ParentAppearance) {
    setPreference({ accountId, value });
    try { if (accountId) localStorage.setItem(`vidya:parent:appearance:v1:${accountId}`, value); } catch { /* Keep the current visit usable. */ }
  }
  return <main className="parent-dashboard parent-family px-5 py-8 sm:py-14" data-parent-appearance={appearance}>
    <div className="mx-auto max-w-xl">
      <div className="parent-appearance flex flex-wrap gap-2" role="group" aria-label="Family space appearance">
        {(["light", "dark", "system"] as const).map(value => <button key={value} type="button" aria-pressed={appearance === value} onClick={() => choose(value)}>{value.charAt(0).toUpperCase() + value.slice(1)}</button>)}
      </div>
      <section className="parent-card space-y-5" aria-labelledby="parent-enrollment-heading">{children}</section>
    </div>
  </main>;
}
