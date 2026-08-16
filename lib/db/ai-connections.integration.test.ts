/**
 * Integration checks for parent-owned AI provider connections.
 *
 * Skipped unless DATABASE_URL is configured. Apply all migrations before
 * running this file against a development database.
 */
const DB_TIMEOUT_MS = 60_000;

import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { EncryptedCredential } from "../ai/credential-vault";
import { dbConfigured, getSql } from "./client";
import {
  createAiConnectionForParent,
  deleteAiConnectionForParent,
  getAiConnectionCredentialForParent,
  listAiConnectionsForParent,
  markAiConnectionUsedForParent,
  replaceDirectAiConnectionCredentialForParent,
  setAiConnectionStatusForParent,
} from "./ai-connections";
import { upsertParent } from "./queries";

const hasDb = dbConfigured();
const d = hasDb ? describe : describe.skip;
const RUN = `ai-connection-itest-${Date.now()}`;
const PARENT_A = `${RUN}-parent-a`;
const PARENT_B = `${RUN}-parent-b`;
const CONNECTION_A = randomUUID();
const CONNECTION_B = randomUUID();
const CONNECTION_OAUTH = randomUUID();
const encrypted = (value: string): EncryptedCredential => ({
  ciphertext: Buffer.from(value).toString("base64"),
  iv: Buffer.alloc(12, 1).toString("base64"),
  tag: Buffer.alloc(16, 2).toString("base64"),
  keyVersion: "v1",
});

d("AI connection database isolation", { timeout: DB_TIMEOUT_MS }, () => {
  beforeAll(async () => {
    await upsertParent({ id: PARENT_A });
    await upsertParent({ id: PARENT_B });
    await createAiConnectionForParent({
      id: CONNECTION_A,
      parentId: PARENT_A,
      actorId: PARENT_A,
      provider: "openai",
      label: `${RUN} OpenAI`,
      source: "api_key",
      status: "active",
      encryptedCredential: encrypted("parent-a-secret"),
      credentialFingerprint: "a".repeat(64),
      credentialHint: "cret",
    });
    await createAiConnectionForParent({
      id: CONNECTION_B,
      parentId: PARENT_B,
      actorId: PARENT_B,
      provider: "anthropic",
      label: `${RUN} Anthropic`,
      source: "api_key",
      status: "active",
      encryptedCredential: encrypted("parent-b-secret"),
      credentialFingerprint: "b".repeat(64),
      credentialHint: "cret",
    });
    await createAiConnectionForParent({
      id: CONNECTION_OAUTH,
      parentId: PARENT_A,
      actorId: PARENT_A,
      provider: "openrouter",
      label: `${RUN} OpenRouter linked`,
      source: "oauth",
      status: "active",
      encryptedCredential: encrypted("parent-a-oauth-secret"),
      credentialFingerprint: "d".repeat(64),
      credentialHint: "cret",
    });
  }, DB_TIMEOUT_MS);

  afterAll(async () => {
    if (!hasDb) return;
    const sql = getSql();
    await sql`delete from parents where id in (${PARENT_A}, ${PARENT_B})`;
  }, DB_TIMEOUT_MS);

  it("lists only the signed-in parent's summaries", async () => {
    const rows = await listAiConnectionsForParent(PARENT_A);
    expect(rows.map((row) => row.id)).toContain(CONNECTION_A);
    expect(rows.map((row) => row.id)).not.toContain(CONNECTION_B);
    expect(JSON.stringify(rows)).not.toContain("parent-a-secret");
    expect(JSON.stringify(rows)).not.toContain("credentialCiphertext");
  });

  it("does not return another parent's encrypted credential by id", async () => {
    expect(await getAiConnectionCredentialForParent(PARENT_A, CONNECTION_B)).toBeNull();
    expect((await getAiConnectionCredentialForParent(PARENT_A, CONNECTION_A))?.provider)
      .toBe("openai");
  });

  it("rejects duplicate labels and credentials for the same parent", async () => {
    await expect(createAiConnectionForParent({
      id: randomUUID(),
      parentId: PARENT_A,
      actorId: PARENT_A,
      provider: "anthropic",
      label: `${RUN} OpenAI`,
      source: "api_key",
      status: "active",
      encryptedCredential: encrypted("different-secret"),
      credentialFingerprint: "c".repeat(64),
      credentialHint: "cret",
    })).rejects.toThrow();

    await expect(createAiConnectionForParent({
      id: randomUUID(),
      parentId: PARENT_A,
      actorId: PARENT_A,
      provider: "openai",
      label: `${RUN} duplicate key`,
      source: "api_key",
      status: "active",
      encryptedCredential: encrypted("parent-a-secret"),
      credentialFingerprint: "a".repeat(64),
      credentialHint: "cret",
    })).rejects.toThrow();
  });

  it("allows OAuth only for the implemented OpenRouter flow", async () => {
    await expect(createAiConnectionForParent({
      id: randomUUID(),
      parentId: PARENT_A,
      actorId: PARENT_A,
      provider: "google",
      label: `${RUN} unsupported OAuth`,
      source: "oauth",
      status: "active",
      encryptedCredential: encrypted("oauth-secret"),
      credentialFingerprint: "d".repeat(64),
      credentialHint: "cret",
    })).rejects.toThrow();
  });

  it("does not update or delete another parent's connection", async () => {
    expect(await setAiConnectionStatusForParent(
      PARENT_A,
      CONNECTION_B,
      "needs_attention",
      PARENT_A,
    )).toBeNull();
    expect(await deleteAiConnectionForParent(PARENT_A, CONNECTION_B, PARENT_A)).toBeNull();
    expect(await getAiConnectionCredentialForParent(PARENT_B, CONNECTION_B)).not.toBeNull();
  });

  it("records an audit event without credential material", async () => {
    const sql = getSql();
    const rows = await sql`
      select event, detail from ai_connection_audit
      where parent_id = ${PARENT_A} and connection_id = ${CONNECTION_A}
      order by created_at asc
    `;
    expect(rows.map((row) => row.event)).toContain("created");
    expect(JSON.stringify(rows)).not.toContain("parent-a-secret");
    expect(JSON.stringify(rows)).not.toContain("encrypted");
  });

  it("replaces only the owner's direct credential and records a safe audit event", async () => {
    const replacement = encrypted("parent-a-replacement");
    const input = {
      parentId: PARENT_A,
      connectionId: CONNECTION_A,
      actorId: PARENT_A,
      status: "active" as const,
      encryptedCredential: replacement,
      credentialFingerprint: "e".repeat(64),
      credentialHint: "5678",
    };

    expect(await replaceDirectAiConnectionCredentialForParent({
      ...input,
      connectionId: CONNECTION_B,
    })).toBeNull();
    expect(await replaceDirectAiConnectionCredentialForParent({
      ...input,
      connectionId: CONNECTION_OAUTH,
    })).toBeNull();

    const updated = await replaceDirectAiConnectionCredentialForParent(input);
    expect(updated?.credentialHint).toBe("5678");
    expect(updated?.lastUsedAt).toBeNull();

    const stored = await getAiConnectionCredentialForParent(PARENT_A, CONNECTION_A);
    expect(stored?.source).toBe("api_key");
    expect(stored?.encryptedCredential).toEqual(replacement);

    const sql = getSql();
    const auditRows = await sql`
      select event, detail from ai_connection_audit
      where parent_id = ${PARENT_A} and connection_id = ${CONNECTION_A}
      order by created_at desc
      limit 1
    `;
    expect(auditRows[0]?.event).toBe("credential_replaced");
    expect(JSON.stringify(auditRows)).not.toContain("parent-a-replacement");
    expect(JSON.stringify(auditRows)).not.toContain(replacement.ciphertext);
  });

  it("records successful use only on the parent's active connection", async () => {
    expect(await markAiConnectionUsedForParent(PARENT_A, CONNECTION_B)).toBe(false);
    expect(await markAiConnectionUsedForParent(PARENT_A, CONNECTION_A)).toBe(true);

    const mine = (await listAiConnectionsForParent(PARENT_A))
      .find((connection) => connection.id === CONNECTION_A);
    expect(mine?.lastUsedAt).not.toBeNull();
  });

  it("lets the owner update status and delete their connection", async () => {
    expect((await setAiConnectionStatusForParent(
      PARENT_A,
      CONNECTION_A,
      "needs_attention",
      PARENT_A,
    ))?.status).toBe("needs_attention");
    expect((await deleteAiConnectionForParent(PARENT_A, CONNECTION_A, PARENT_A))?.id)
      .toBe(CONNECTION_A);
    expect(await getAiConnectionCredentialForParent(PARENT_A, CONNECTION_A)).toBeNull();
  });
});

(hasDb ? describe.skip : describe)("AI connection database integration (skipped)", () => {
  it("requires DATABASE_URL and migration 0006", () => {
    expect(hasDb).toBe(false);
  });
});
