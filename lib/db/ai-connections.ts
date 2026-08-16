import "server-only";

import type {
  AiConnectionSource,
  AiConnectionStatus,
  AiConnectionSummary,
} from "../ai/connection-summary";
import type { EncryptedCredential } from "../ai/credential-vault";
import { isAiProviderId, type AiProviderId } from "../ai/providers";
import { getSql, type Row } from "./client";

export type {
  AiConnectionSource,
  AiConnectionStatus,
  AiConnectionSummary,
} from "../ai/connection-summary";

export type AiConnectionCredential = {
  id: string;
  provider: AiProviderId;
  encryptedCredential: EncryptedCredential;
};

function providerFromRow(row: Row): AiProviderId {
  if (!isAiProviderId(row.provider)) {
    throw new Error("Database row contains an unsupported AI provider.");
  }
  return row.provider;
}

function sourceFromRow(row: Row): AiConnectionSource {
  if (row.source !== "api_key" && row.source !== "oauth") {
    throw new Error("Database row contains an unsupported AI connection source.");
  }
  return row.source;
}

function statusFromRow(row: Row): AiConnectionStatus {
  if (row.status !== "active" && row.status !== "needs_attention") {
    throw new Error("Database row contains an unsupported AI connection status.");
  }
  return row.status;
}

export function aiConnectionSummaryFromRow(row: Row): AiConnectionSummary {
  return {
    id: String(row.id),
    provider: providerFromRow(row),
    label: String(row.label),
    source: sourceFromRow(row),
    status: statusFromRow(row),
    credentialHint: String(row.credential_hint),
    lastValidatedAt: String(row.last_validated_at),
    lastUsedAt: row.last_used_at == null ? null : String(row.last_used_at),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export function aiConnectionCredentialFromRow(row: Row): AiConnectionCredential {
  return {
    id: String(row.id),
    provider: providerFromRow(row),
    encryptedCredential: {
      ciphertext: String(row.credential_ciphertext),
      iv: String(row.credential_iv),
      tag: String(row.credential_tag),
      keyVersion: String(row.credential_key_version),
    },
  };
}

export async function listAiConnectionsForParent(
  parentId: string,
): Promise<AiConnectionSummary[]> {
  const sql = getSql();
  const rows = await sql`
    select id, provider, label, source, status, credential_hint,
           last_validated_at, last_used_at, created_at, updated_at
    from ai_provider_connections
    where parent_id = ${parentId}
    order by created_at desc
  `;
  return rows.map(aiConnectionSummaryFromRow);
}

export async function getAiConnectionCredentialForParent(
  parentId: string,
  connectionId: string,
): Promise<AiConnectionCredential | null> {
  const sql = getSql();
  const rows = await sql`
    select id, provider, credential_ciphertext, credential_iv,
           credential_tag, credential_key_version
    from ai_provider_connections
    where id = ${connectionId} and parent_id = ${parentId}
    limit 1
  `;
  return rows.length ? aiConnectionCredentialFromRow(rows[0]) : null;
}

export async function createAiConnectionForParent(input: {
  id: string;
  parentId: string;
  actorId: string;
  provider: AiProviderId;
  label: string;
  source: AiConnectionSource;
  status: AiConnectionStatus;
  encryptedCredential: EncryptedCredential;
  credentialFingerprint: string;
  credentialHint: string;
  providerAccountId?: string | null;
}): Promise<AiConnectionSummary> {
  const sql = getSql();
  const rows = await sql`
    with inserted as (
      insert into ai_provider_connections (
        id, parent_id, provider, label, source, status,
        credential_ciphertext, credential_iv, credential_tag,
        credential_key_version, credential_fingerprint, credential_hint,
        provider_account_id, last_validated_at
      ) values (
        ${input.id}, ${input.parentId}, ${input.provider}, ${input.label},
        ${input.source}, ${input.status},
        ${input.encryptedCredential.ciphertext}, ${input.encryptedCredential.iv},
        ${input.encryptedCredential.tag}, ${input.encryptedCredential.keyVersion},
        ${input.credentialFingerprint}, ${input.credentialHint},
        ${input.providerAccountId ?? null}, now()
      )
      returning *
    ), audited as (
      insert into ai_connection_audit (
        parent_id, connection_id, provider, event, actor, detail
      )
      select parent_id, id, provider, 'created', ${input.actorId},
             jsonb_build_object('label', label, 'source', source, 'status', status)
      from inserted
      returning id
    )
    select * from inserted
  `;
  return aiConnectionSummaryFromRow(rows[0]);
}

export async function setAiConnectionStatusForParent(
  parentId: string,
  connectionId: string,
  status: AiConnectionStatus,
  actorId: string,
): Promise<AiConnectionSummary | null> {
  const sql = getSql();
  const rows = await sql`
    with changed as (
      update ai_provider_connections
      set status = ${status}, last_validated_at = now()
      where id = ${connectionId} and parent_id = ${parentId}
      returning *
    ), audited as (
      insert into ai_connection_audit (
        parent_id, connection_id, provider, event, actor, detail
      )
      select parent_id, id, provider, 'status_changed', ${actorId},
             jsonb_build_object('status', status)
      from changed
      returning id
    )
    select * from changed
  `;
  return rows.length ? aiConnectionSummaryFromRow(rows[0]) : null;
}

export async function markAiConnectionUsedForParent(
  parentId: string,
  connectionId: string,
): Promise<boolean> {
  const sql = getSql();
  const rows = await sql`
    update ai_provider_connections
    set last_used_at = now()
    where id = ${connectionId}
      and parent_id = ${parentId}
      and status = 'active'
    returning id
  `;
  return rows.length > 0;
}

export async function deleteAiConnectionForParent(
  parentId: string,
  connectionId: string,
  actorId: string,
): Promise<AiConnectionSummary | null> {
  const sql = getSql();
  const rows = await sql`
    with deleted as (
      delete from ai_provider_connections
      where id = ${connectionId} and parent_id = ${parentId}
      returning *
    ), audited as (
      insert into ai_connection_audit (
        parent_id, connection_id, provider, event, actor, detail
      )
      select parent_id, id, provider, 'deleted', ${actorId},
             jsonb_build_object('label', label, 'source', source)
      from deleted
      returning id
    )
    select * from deleted
  `;
  return rows.length ? aiConnectionSummaryFromRow(rows[0]) : null;
}
