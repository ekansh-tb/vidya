/** Authentication returns only to a normalized internal protected workspace. */
export function parentReturnPath(value?: string | null): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return "/parent";
  // Reject ambiguous encoding and traversal before the browser normalizes the URL.
  const path = value.split(/[?#]/, 1)[0];
  if (/[\\\s\u0000-\u001f\u007f]/.test(value) || /%|(?:^|\/)\.{1,2}(?:\/|$)/.test(path)) return "/parent";
  if (/^\/(parent|admin)(?:\/|$)/.test(path)) return value;
  return "/parent";
}

/** The parent production host serves a different root from the learning app. */
export function learningAppHref(host: string | null): string {
  return host?.toLowerCase() === "parents.vidyagyan.study" ? "https://vidyagyan.study/" : "/";
}
