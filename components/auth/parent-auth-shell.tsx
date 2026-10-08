import Link from "next/link";

export function ParentAuthShell({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode: "sign-in" | "sign-up";
}) {
  const signingIn = mode === "sign-in";
  return (
    <main className="parent-auth-shell">
      <div className="parent-auth-content">
        <Link href="/" className="parent-auth-brand" aria-label="Vidya learning home">
          <span className="kids-brand-mark" aria-hidden="true">v<span>•</span></span>
          <strong>vidya</strong>
          <span className="parent-auth-label">For parents</span>
        </Link>
        <header className="parent-auth-intro">
          <h1>{signingIn ? "Welcome back" : "Your family's learning starts here"}</h1>
          <p>{signingIn
            ? "Sign in to see your child’s learning and manage your family."
            : "Create your parent account. Then add a learner and connect their device."}</p>
        </header>
        {children}
        <p className="parent-auth-help">Children open their learning space with a device code from you.</p>
        <Link className="parent-auth-home" href="/privacy">How we use family and sign-in information</Link>
        <Link className="parent-auth-home" href="/">Back to the learning app</Link>
      </div>
    </main>
  );
}
