/** A parent login always returns to an internal parent page. */
export function parentReturnPath(value?: string | null): string {
  if (!value || value.includes("\\") || value.startsWith("//")) return "/parent";
  if (value === "/parent" || value.startsWith("/parent/") || value.startsWith("/parent?")) return value;
  return "/parent";
}
