import Link from "next/link";
import { headers } from "next/headers";
import { learningAppHref } from "@/lib/auth/parent-return";

export async function ParentAuthShell({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode: "sign-in" | "sign-up";
}) {
  const learningHref = learningAppHref((await headers()).get("host"));
  const signingIn = mode === "sign-in";
  return (
    <main className="parent-auth-shell">
      <div className="parent-auth-content">
        <Link href={learningHref} className="parent-auth-brand" aria-label="Vidya learning home">
          <span className="kids-brand-mark" aria-hidden="true">v<span>•</span></span>
          <strong>vidya</strong>
          <span className="parent-auth-label">For parents</span>
        </Link>
        <header className="parent-auth-intro">
          <h1>{signingIn ? "Welcome back" : "Room for their curiosity"}</h1>
          <p>{signingIn
            ? "Sign in to see your child’s learning and manage your family."
            : "Your account first. Their learning space next. Children don’t need their own email."}</p>
        </header>
        <ol className="family-setup-steps" aria-label="Family setup"><li aria-current="step"><span>1</span>Your account</li><li><span>2</span>Add your child</li><li><span>3</span>Connect a device</li></ol>
        {children}
        <p className="parent-auth-help">Children open their learning space with a device code from you.</p>
        <Link className="parent-auth-home" href="/privacy">How we use family and sign-in information</Link>
        <Link className="parent-auth-home" href={learningHref}>Back to the learning app</Link>
      </div>
    </main>
  );
}
