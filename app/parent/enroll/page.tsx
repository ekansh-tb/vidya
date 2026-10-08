import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { resolveIdentity } from "@/lib/auth/session";
import { accountAuthority } from "@/lib/db/account-links";
import { ParentEntryShell } from "./parent-entry-shell";
import { ParentEnrollmentForm } from "./parent-enrollment-form";

export const dynamic = "force-dynamic";

export default async function Page() {
  const identity = await resolveIdentity();
  if (identity.kind === "parent") redirect("/parent");
  if (identity.kind === "anonymous" && identity.reason === "no_session") {
    redirect("/sign-in?next=/parent/enroll");
  }
  const unavailable = identity.kind === "anonymous" &&
    (identity.reason === "auth_disabled" || identity.reason === "db_disabled");
  let blocked = identity.kind === "learner" ||
    (identity.kind === "anonymous" && identity.reason === "revoked");
  if (!unavailable && !blocked) {
    const { userId } = await auth();
    const authority = userId ? await accountAuthority(userId) : null;
    blocked = authority === "learner" || authority === "revoked";
  }
  return (
    <ParentEntryShell>
        <p className="text-sm text-neutral-400">Vidya · Parent and guardian entry</p>
        <h1 id="parent-enrollment-heading" className="font-display text-3xl font-bold">Your parent account</h1>
        {unavailable ? (
          <p role="status">Parent enrollment is temporarily unavailable. Please try again later.</p>
        ) : <ParentEnrollmentForm blocked={blocked} />}
    </ParentEntryShell>
  );
}
