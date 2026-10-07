import { SignUp } from "@clerk/nextjs";
import { ParentAuthShell } from "@/components/auth/parent-auth-shell";
import { parentAuthAppearance } from "@/lib/auth/clerk-appearance";
import { parentReturnPath } from "@/lib/auth/parent-return";

/** Children are enrolled by their parent, rather than creating Clerk accounts. */
export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const redirectTo = parentReturnPath(next);
  return (
    <ParentAuthShell mode="sign-up">
      <SignUp
        signInUrl={"/sign-in?next=" + encodeURIComponent(redirectTo)}
        fallbackRedirectUrl={redirectTo}
        appearance={parentAuthAppearance}
      />
    </ParentAuthShell>
  );
}
