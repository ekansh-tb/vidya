/** Test-only connector. No environment loading, migrations or ambient opt-in. */
import { Client } from "pg";
import { integrationDatabaseConfigured } from "../../test/integration-database";

export function accountLinkTestDatabaseConfigured(): boolean {
  try {
    if (!integrationDatabaseConfigured()) return false;
    const url = new URL(process.env.DATABASE_URL!);
    if (!["postgres:", "postgresql:"].includes(url.protocol)) throw new Error();
    return true;
  } catch { throw new Error("Account integration tests require explicit opt-in and the dedicated database/role URL."); }
}

export async function connectAccountTestDatabase() {
  if (!accountLinkTestDatabaseConfigured()) throw new Error("Account integration tests are not explicitly enabled.");
  let client: Client | undefined;
  try {
    client = new Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000,
      statement_timeout: 7000, query_timeout: 10000, idle_in_transaction_session_timeout: 10000 });
    // Never let pg's raw asynchronous errors print connection details.
    client.on("error", () => undefined);
    await client.connect();
    const result = await client.query("select current_database() as database, current_user as role, session_user as login");
    const identity = result.rows[0];
    if (identity?.database !== "vidya_integration" || identity?.role !== "vidya_test_runner" || identity?.login !== "vidya_test_runner") {
      throw new Error("Identity mismatch");
    }
  } catch {
    await client?.end().catch(() => undefined);
    throw new Error("Could not verify the isolated account test database and connected role.");
  }
  const verifiedClient = client;
  return {
    async query(text: string, values?: unknown[]) {
      try { return await verifiedClient.query(text, values); }
      catch (error) {
        const code = error && typeof error === "object" && "code" in error ? error.code : undefined;
        const suffix = typeof code === "string" && /^[A-Z0-9]{5}$/.test(code) ? ` SQLSTATE ${code}.` : "";
        throw new Error(`Isolated account test database query failed; raw database diagnostics suppressed.${suffix}`);
      }
    },
    async end() {
      try { await verifiedClient.end(); }
      catch { throw new Error("Isolated account test database disconnect failed."); }
    },
  };
}
export type AccountTestClient = Awaited<ReturnType<typeof connectAccountTestDatabase>>;
