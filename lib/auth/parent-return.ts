/** Authentication returns only to an internal protected workspace. */
export function parentReturnPath(value?: string | null): string {
  if (!value || value.includes("\\") || value.startsWith("//")) return "/parent";
  if (value === "/parent" || value.startsWith("/parent/") || value.startsWith("/parent?")) return value;
  if (value === "/admin" || value.startsWith("/admin/") || value.startsWith("/admin?")) return value;
  return "/parent";
}
