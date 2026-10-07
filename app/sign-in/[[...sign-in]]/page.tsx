import { SignIn } from "@clerk/nextjs";
import { ParentAuthShell } from "@/components/auth/parent-auth-shell";
import { parentAuthAppearance } from "@/lib/auth/clerk-appearance";
import { parentReturnPath } from "@/lib/auth/parent-return";

/** Catch-all keeps Clerk verification and OAuth callback steps on this route. */
export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const redirectTo = parentReturnPath(next);
  return (
    <ParentAuthShell mode="sign-in">
      <SignIn
        signUpUrl={"/sign-up?next=" + encodeURIComponent(redirectTo)}
        fallbackRedirectUrl={redirectTo}
        appearance={parentAuthAppearance}
      />
    </ParentAuthShell>
  );
}
