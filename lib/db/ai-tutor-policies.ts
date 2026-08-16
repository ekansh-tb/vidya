import "server-only";

import type { EncryptedCredential } from "../ai/credential-vault";
import { isAiProviderId, type AiProviderId } from "../ai/providers";
import {
  isTutorDailyTurnLimit,
  isTutorMaxOutputTokens,
  isTutorModelId,
} from "../ai/tutor-policy";
import type {
  AiTutorProfileSummary,
  LearnerAiAssignmentSummary,
} from "../ai/tutor-profile-summary";
import { getSql, type Row } from "./client";

export type {
  AiTutorProfileSummary,
  LearnerAiAssignmentSummary,
} from "../ai/tutor-profile-summary";

export type LearnerAiTutorRuntimePolicy = {
  learnerId: string;
  parentId: string;
  tutorProfileId: string;
  connectionId: string;
  provider: AiProviderId;
  modelId: string;
  dailyTurnLimit: number;
  maxOutputTokens: number;
  encryptedCredential: EncryptedCredential;
};

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Database row contains an invalid ${field}.`);
  }
  return value;
}

function timestampString(value: unknown, field: string): string {
  if (typeof value === "string" && value.length > 0) return value;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString();
  throw new Error(`Database row contains an invalid ${field}.`);
}

export function aiTutorProfileSummaryFromRow(row: Row): AiTutorProfileSummary {
  if (!isAiProviderId(row.provider)) {
    throw new Error("Database row contains an unsupported AI provider.");
  }
  if (row.connection_status !== "active" && row.connection_status !== "needs_attention") {
    throw new Error("Database row contains an invalid AI connection status.");
  }
  if (!isTutorModelId(row.model_id)) {
    throw new Error("Database row contains an invalid tutor model id.");
  }
  return {
    id: requiredString(row.id, "tutor profile id"),
    name: requiredString(row.name, "tutor profile name"),
    connectionId: requiredString(row.connection_id, "AI connection id"),
    connectionLabel: requiredString(row.connection_label, "AI connection label"),
    provider: row.provider,
    connectionStatus: row.connection_status,
    modelId: row.model_id,
    createdAt: timestampString(row.created_at, "created timestamp"),
    updatedAt: timestampString(row.updated_at, "updated timestamp"),
  };
}

export function learnerAiAssignmentSummaryFromRow(row: Row): LearnerAiAssignmentSummary {
  const dailyTurnLimit = Number(row.daily_turn_limit);
  const maxOutputTokens = Number(row.max_output_tokens);
  if (!isTutorDailyTurnLimit(dailyTurnLimit) || !isTutorMaxOutputTokens(maxOutputTokens)) {
    throw new Error("Database row contains invalid tutor limits.");
  }
  if (typeof row.enabled !== "boolean") {
    throw new Error("Database row contains an invalid tutor enabled state.");
  }
  return {
    learnerId: requiredString(row.learner_id, "learner id"),
    tutorProfileId: requiredString(row.tutor_profile_id, "tutor profile id"),
    enabled: row.enabled,
    dailyTurnLimit,
    maxOutputTokens,
    createdAt: timestampString(row.created_at, "created timestamp"),
    updatedAt: timestampString(row.updated_at, "updated timestamp"),
  };
}

export function learnerAiTutorRuntimePolicyFromRow(row: Row): LearnerAiTutorRuntimePolicy {
  const dailyTurnLimit = Number(row.daily_turn_limit);
  const maxOutputTokens = Number(row.max_output_tokens);
  if (!isTutorDailyTurnLimit(dailyTurnLimit) || !isTutorMaxOutputTokens(maxOutputTokens)) {
    throw new Error("Database row contains invalid tutor limits.");
  }
  if (!isAiProviderId(row.provider)) {
    throw new Error("Database row contains an unsupported AI provider.");
  }
  if (!isTutorModelId(row.model_id)) {
    throw new Error("Database row contains an invalid tutor model id.");
  }
  return {
    learnerId: requiredString(row.learner_id, "learner id"),
    parentId: requiredString(row.parent_id, "parent id"),
    tutorProfileId: requiredString(row.tutor_profile_id, "tutor profile id"),
    connectionId: requiredString(row.connection_id, "AI connection id"),
    provider: row.provider,
    modelId: row.model_id,
    dailyTurnLimit,
    maxOutputTokens,
    encryptedCredential: {
      ciphertext: requiredString(row.credential_ciphertext, "credential ciphertext"),
      iv: requiredString(row.credential_iv, "credential iv"),
      tag: requiredString(row.credential_tag, "credential tag"),
      keyVersion: requiredString(row.credential_key_version, "credential key version"),
    },
  };
}

export async function listAiTutorProfilesForParent(
  parentId: string,
): Promise<AiTutorProfileSummary[]> {
  const sql = getSql();
  const rows = await sql`
    select p.id, p.name, p.connection_id, p.model_id,
           p.created_at, p.updated_at,
           c.label as connection_label, c.provider,
           c.status as connection_status
    from ai_tutor_profiles p
    join ai_provider_connections c
      on c.id = p.connection_id and c.parent_id = p.parent_id
    where p.parent_id = ${parentId}
    order by p.created_at desc
  `;
  return rows.map(aiTutorProfileSummaryFromRow);
}

export async function createAiTutorProfileForParent(input: {
  id: string;
  parentId: string;
  actorId: string;
  connectionId: string;
  name: string;
  modelId: string;
}): Promise<AiTutorProfileSummary | null> {
  const sql = getSql();
  const rows = await sql`
    with inserted as (
      insert into ai_tutor_profiles (id, parent_id, connection_id, name, model_id)
      select ${input.id}, ${input.parentId}, c.id, ${input.name}, ${input.modelId}
      from ai_provider_connections c
      where c.id = ${input.connectionId}
        and c.parent_id = ${input.parentId}
        and c.status = 'active'
      returning *
    ), audited as (
      insert into ai_tutor_policy_audit (
        parent_id, tutor_profile_id, event, actor, detail
      )
      select parent_id, id, 'profile_created', ${input.actorId},
             jsonb_build_object(
               'name', name,
               'connection_id', connection_id,
               'model_id', model_id
             )
      from inserted
      returning id
    )
    select p.id, p.name, p.connection_id, p.model_id,
           p.created_at, p.updated_at,
           c.label as connection_label, c.provider,
           c.status as connection_status
    from inserted p
    join ai_provider_connections c
      on c.id = p.connection_id and c.parent_id = p.parent_id
  `;
  return rows.length ? aiTutorProfileSummaryFromRow(rows[0]) : null;
}

export async function deleteAiTutorProfileForParent(
  parentId: string,
  tutorProfileId: string,
  actorId: string,
): Promise<boolean> {
  const sql = getSql();
  const rows = await sql`
    with deleted as (
      delete from ai_tutor_profiles
      where id = ${tutorProfileId} and parent_id = ${parentId}
      returning id, parent_id, name
    ), audited as (
      insert into ai_tutor_policy_audit (
        parent_id, tutor_profile_id, event, actor, detail
      )
      select parent_id, id, 'profile_deleted', ${actorId},
             jsonb_build_object('name', name)
      from deleted
      returning id
    )
    select id from deleted
  `;
  return rows.length > 0;
}

export async function setLearnerAiAssignmentForParent(input: {
  parentId: string;
  actorId: string;
  learnerId: string;
  tutorProfileId: string;
  enabled: boolean;
  dailyTurnLimit: number;
  maxOutputTokens: number;
}): Promise<LearnerAiAssignmentSummary | null> {
  const sql = getSql();
  const rows = await sql`
    with upserted as (
      insert into learner_ai_assignments (
        learner_id, parent_id, tutor_profile_id, enabled,
        daily_turn_limit, max_output_tokens
      )
      select l.id, ${input.parentId}, p.id, ${input.enabled},
             ${input.dailyTurnLimit}, ${input.maxOutputTokens}
      from learners l
      join ai_tutor_profiles p
        on p.id = ${input.tutorProfileId} and p.parent_id = ${input.parentId}
      join ai_provider_connections c
        on c.id = p.connection_id and c.parent_id = p.parent_id
      where l.id = ${input.learnerId} and l.parent_id = ${input.parentId}
        and (${input.enabled} = false or c.status = 'active')
      on conflict (learner_id) do update set
        tutor_profile_id = excluded.tutor_profile_id,
        enabled = excluded.enabled,
        daily_turn_limit = excluded.daily_turn_limit,
        max_output_tokens = excluded.max_output_tokens
      where learner_ai_assignments.parent_id = excluded.parent_id
      returning *
    ), audited as (
      insert into ai_tutor_policy_audit (
        parent_id, tutor_profile_id, learner_id, event, actor, detail
      )
      select parent_id, tutor_profile_id, learner_id, 'assignment_set', ${input.actorId},
             jsonb_build_object(
               'enabled', enabled,
               'daily_turn_limit', daily_turn_limit,
               'max_output_tokens', max_output_tokens
             )
      from upserted
      returning id
    )
    select * from upserted
  `;
  return rows.length ? learnerAiAssignmentSummaryFromRow(rows[0]) : null;
}

export async function getLearnerAiAssignmentForParent(
  parentId: string,
  learnerId: string,
): Promise<LearnerAiAssignmentSummary | null> {
  const sql = getSql();
  const rows = await sql`
    select a.*
    from learner_ai_assignments a
    join learners l on l.id = a.learner_id and l.parent_id = a.parent_id
    where a.learner_id = ${learnerId} and a.parent_id = ${parentId}
    limit 1
  `;
  return rows.length ? learnerAiAssignmentSummaryFromRow(rows[0]) : null;
}

/**
 * Resolve the enabled tutor policy for a learner identity already authenticated
 * by a device token or learner session. Every join repeats the same parent id,
 * so a corrupted cross-family reference cannot expose another parent's key.
 */
export async function getLearnerAiTutorRuntimePolicy(
  learnerId: string,
): Promise<LearnerAiTutorRuntimePolicy | null> {
  const sql = getSql();
  const rows = await sql`
    select a.learner_id, a.parent_id, a.tutor_profile_id,
           a.daily_turn_limit, a.max_output_tokens,
           p.model_id, c.id as connection_id, c.provider,
           c.credential_ciphertext, c.credential_iv,
           c.credential_tag, c.credential_key_version
    from learner_ai_assignments a
    join learners l
      on l.id = a.learner_id and l.parent_id = a.parent_id
    join ai_tutor_profiles p
      on p.id = a.tutor_profile_id and p.parent_id = a.parent_id
    join ai_provider_connections c
      on c.id = p.connection_id and c.parent_id = a.parent_id
    where a.learner_id = ${learnerId}
      and a.enabled = true
      and c.status = 'active'
    limit 1
  `;
  return rows.length ? learnerAiTutorRuntimePolicyFromRow(rows[0]) : null;
}

export async function removeLearnerAiAssignmentForParent(
  parentId: string,
  learnerId: string,
  actorId: string,
): Promise<boolean> {
  const sql = getSql();
  const rows = await sql`
    with deleted as (
      delete from learner_ai_assignments
      where learner_id = ${learnerId} and parent_id = ${parentId}
      returning *
    ), audited as (
      insert into ai_tutor_policy_audit (
        parent_id, tutor_profile_id, learner_id, event, actor
      )
      select parent_id, tutor_profile_id, learner_id, 'assignment_removed', ${actorId}
      from deleted
      returning id
    )
    select learner_id from deleted
  `;
  return rows.length > 0;
}
