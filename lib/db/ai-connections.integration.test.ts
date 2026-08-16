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
