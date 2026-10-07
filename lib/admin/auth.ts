import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";
import { clerkConfigured } from "@/lib/auth/clerk-config";

/** Exact server-controlled Clerk identities. Never inferred from parent role or email. */
export function ownerIds(value = process.env.VIDYA_ADMIN_CLERK_USER_IDS): Set<string> {
  return new Set((value ?? "").split(",").map(id => id.trim()).filter(id => /^user_[A-Za-z0-9]+$/.test(id)));
}
export async function requireOwner(): Promise<{ userId: string } | null> {
  if (!clerkConfigured || ownerIds().size === 0) return null;
  try {
  const { userId } = await auth();
  if (!userId || !ownerIds().has(userId)) return null;
  const user = await currentUser();
  return user?.id === userId ? { userId } : null;
  } catch { return null; }
}
