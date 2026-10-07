import Link from "next/link";
import { requireOwner } from "@/lib/admin/auth";
import { dbConfigured } from "@/lib/db/client";
import { AdminWorkspace } from "./workspace";
import "./admin.css";
export const dynamic = "force-dynamic";
export default async function Page() {
  const owner = await requireOwner();
  if (!owner) return <main className="admin-shell admin-denied"><h1>Owner access required</h1><p>This workspace is available only to explicitly authorized Vidya owners.</p><Link href="/">Return to Vidya</Link></main>;
  if (!dbConfigured()) return <main className="admin-shell admin-denied"><h1>Owner workspace unavailable</h1><p>Storage is not configured. No learner information has been loaded.</p><Link href="/">Return to Vidya</Link></main>;
  return <AdminWorkspace />;
}
