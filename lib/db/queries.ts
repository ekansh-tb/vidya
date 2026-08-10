import "server-only";

import { getSql } from "./client";
import type { GameState, SubjectId } from "../types";

/**
 * Data access for parents, learners and learner state.
 *
 * THE ONE RULE THIS FILE EXISTS TO ENFORCE
 * ----------------------------------------
 * Strict per-learner isolation. Every function that reads or writes a
 * learner's data takes the *requesting identity* and scopes the SQL by
 * ownership — never by learner id alone. There is deliberately no
 * `getLearnerById(id)`, because such a function is exactly how one family
 * ends up reading another family's child by guessing a UUID.
 *
 * If you add a query here, it must answer: "whose data is this, and how does
 * the SQL prove the caller is allowed to see it?"
 */

export type VerificationLevel = 0 | 1 | 2 | 3;

export type LearnerRow = {
  id: string;
  parentId: string | null;
  clerkUserId: string | null;
  name: string;
  grade: number;
  board: string;
  school: string | null;
  city: string | null;
  verificationLevel: VerificationLevel;
  pickedSubjects: SubjectId[] | null;
  subjectsLocked: boolean;
  localId: string | null;
  createdAt: string;
  updatedAt: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any -- rows come back untyped
   from the driver; each mapper below is the single place we give them shape. */
function toLearner(r: any): LearnerRow {
  return {
    id: r.id,
    parentId: r.parent_id ?? null,
    clerkUserId: r.clerk_user_id ?? null,
    name: r.name,
    grade: r.grade,
    board: r.board,
    school: r.school ?? null,
    city: r.city ?? null,
    verificationLevel: r.verification_level as VerificationLevel,
    pickedSubjects: r.picked_subjects ?? null,
    subjectsLocked: Boolean(r.subjects_locked),
    localId: r.local_id ?? null,
    createdAt: String(r.created_at),
    updatedAt: String(r.updated_at),
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ------------------------------------------------------------------ parents

/** Upsert the signed-in parent. Called after Clerk auth, never with user input. */
export async function upsertParent(input: {
  id: string;
  email?: string | null;
  displayName?: string | null;
}): Promise<void> {
  const sql = getSql();
  await sql`
    insert into parents (id, email, display_name)
    values (${input.id}, ${input.email ?? null}, ${input.displayName ?? null})
    on conflict (id) do update
      set email = coalesce(excluded.email, parents.email),
          display_name = coalesce(excluded.display_name, parents.display_name)
  `;
}

// ----------------------------------------------------------------- learners

/** Every learner owned by this parent. Scoped by parent_id, not by id. */
export async function listLearnersForParent(parentId: string): Promise<LearnerRow[]> {
  const sql = getSql();
  const rows = await sql`
    select * from learners
    where parent_id = ${parentId}
    order by created_at asc
  `;
  return rows.map(toLearner);
}

/**
 * A single learner, but only if this parent owns them.
 * Returns null rather than throwing so callers answer 404, not 403 — we do not
 * confirm the existence of another family's learner.
 */
export async function getLearnerForParent(
  parentId: string,
  learnerId: string,
): Promise<LearnerRow | null> {
  const sql = getSql();
  const rows = await sql`
    select * from learners
    where id = ${learnerId} and parent_id = ${parentId}
    limit 1
  `;
  return rows.length ? toLearner(rows[0]) : null;
}

/** The learner belonging to a signed-in kid. Scoped by their own Clerk id. */
export async function getLearnerForClerkUser(clerkUserId: string): Promise<LearnerRow | null> {
  const sql = getSql();
  const rows = await sql`
    select * from learners
    where clerk_user_id = ${clerkUserId}
    limit 1
  `;
  return rows.length ? toLearner(rows[0]) : null;
}

export async function createLearner(input: {
  parentId: string;
  name: string;
  grade: number;
  board: string;
  school?: string | null;
  city?: string | null;
  localId?: string | null;
  pickedSubjects?: SubjectId[] | null;
  subjectsLocked?: boolean;
}): Promise<LearnerRow> {
  const sql = getSql();
  const rows = await sql`
    insert into learners
      (parent_id, name, grade, board, school, city, local_id, picked_subjects, subjects_locked)
    values
      (${input.parentId}, ${input.name}, ${input.grade}, ${input.board},
       ${input.school ?? null}, ${input.city ?? null}, ${input.localId ?? null},
       ${JSON.stringify(input.pickedSubjects ?? null)}::jsonb,
       ${input.subjectsLocked ?? false})
    returning *
  `;
  await audit({ parentId: input.parentId, learnerId: rows[0].id, event: "created", actor: input.parentId });
  return toLearner(rows[0]);
}

/** Update profile fields. The where-clause carries the ownership check. */
export async function updateLearnerForParent(
  parentId: string,
  learnerId: string,
  patch: Partial<Pick<LearnerRow, "name" | "grade" | "board" | "school" | "city" | "subjectsLocked">> & {
    pickedSubjects?: SubjectId[] | null;
  },
): Promise<LearnerRow | null> {
  const sql = getSql();
  const rows = await sql`
    update learners set
      name            = coalesce(${patch.name ?? null}, name),
      grade           = coalesce(${patch.grade ?? null}, grade),
      board           = coalesce(${patch.board ?? null}, board),
      school          = coalesce(${patch.school ?? null}, school),
      city            = coalesce(${patch.city ?? null}, city),
      subjects_locked = coalesce(${patch.subjectsLocked ?? null}, subjects_locked),
      picked_subjects = coalesce(${patch.pickedSubjects === undefined ? null : JSON.stringify(patch.pickedSubjects)}::jsonb, picked_subjects)
    where id = ${learnerId} and parent_id = ${parentId}
    returning *
  `;
  return rows.length ? toLearner(rows[0]) : null;
}

// ----------------------------------------------------------- learner state

export type StateEnvelope = {
  state: GameState;
  revision: number;
  updatedAt: string;
  deviceLabel: string | null;
};

/** Read state for a learner the caller has already been proven to own. */
export async function getLearnerState(learnerId: string): Promise<StateEnvelope | null> {
  const sql = getSql();
  const rows = await sql`
    select state, revision, updated_at, device_label
    from learner_states where learner_id = ${learnerId}
    limit 1
  `;
  if (!rows.length) return null;
  return {
    state: rows[0].state as GameState,
    revision: Number(rows[0].revision),
    updatedAt: String(rows[0].updated_at),
    deviceLabel: rows[0].device_label ?? null,
  };
}

export type PushResult =
  | { ok: true; revision: number }
  | { ok: false; reason: "conflict"; serverRevision: number; serverState: GameState };

/**
 * Push state with optimistic concurrency.
 *
 * `expectedRevision` is the revision the client last saw. If the server has
 * moved on — another device synced in between — we refuse and hand back the
 * server's copy rather than overwriting it. Silent last-write-wins across two
 * devices is how a kid loses an evening's work.
 *
 * Pass expectedRevision = 0 for a first push.
 */
export async function pushLearnerState(input: {
  learnerId: string;
  state: GameState;
  expectedRevision: number;
  deviceLabel?: string | null;
}): Promise<PushResult> {
  const sql = getSql();
  const current = await getLearnerState(input.learnerId);

  if (!current) {
    const rows = await sql`
      insert into learner_states (learner_id, state, revision, device_label)
      values (${input.learnerId}, ${JSON.stringify(input.state)}::jsonb, 1, ${input.deviceLabel ?? null})
      on conflict (learner_id) do nothing
      returning revision
    `;
    if (rows.length) return { ok: true, revision: Number(rows[0].revision) };
    // Lost an insert race — fall through and re-read.
    const raced = await getLearnerState(input.learnerId);
    return raced
      ? { ok: false, reason: "conflict", serverRevision: raced.revision, serverState: raced.state }
      : { ok: true, revision: 1 };
  }

  if (current.revision !== input.expectedRevision) {
    return {
      ok: false,
      reason: "conflict",
      serverRevision: current.revision,
      serverState: current.state,
    };
  }

  const rows = await sql`
    update learner_states
    set state = ${JSON.stringify(input.state)}::jsonb,
        revision = revision + 1,
        device_label = ${input.deviceLabel ?? null}
    where learner_id = ${input.learnerId} and revision = ${input.expectedRevision}
    returning revision
  `;
  if (!rows.length) {
    const latest = await getLearnerState(input.learnerId);
    return {
      ok: false,
      reason: "conflict",
      serverRevision: latest?.revision ?? current.revision,
      serverState: latest?.state ?? current.state,
    };
  }
  return { ok: true, revision: Number(rows[0].revision) };
}

// ------------------------------------------------------------- claim codes

/** Human-readable, unambiguous alphabet — no O/0/I/1 for a kid typing it. */
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateCode(length = 6): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < length; i++) out += CODE_ALPHABET[bytes[i]! % CODE_ALPHABET.length];
  return out;
}

/**
 * Issue a single-use claim code for a learner this parent owns.
 * Any previously unused code for the learner is invalidated, so a code shown
 * and abandoned cannot be used later.
 */
export async function issueClaimCode(
  parentId: string,
  learnerId: string,
  ttlMinutes = 60 * 24,
): Promise<{ code: string; expiresAt: string } | null> {
  const owned = await getLearnerForParent(parentId, learnerId);
  if (!owned) return null;

  const sql = getSql();
  await sql`delete from claim_codes where learner_id = ${learnerId} and used_at is null`;

  // Retry on the vanishingly unlikely primary-key collision.
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateCode();
    const rows = await sql`
      insert into claim_codes (code, learner_id, created_by, expires_at)
      values (${code}, ${learnerId}, ${parentId},
              now() + (${ttlMinutes} || ' minutes')::interval)
      on conflict (code) do nothing
      returning code, expires_at
    `;
    if (rows.length) {
      return { code: rows[0].code, expiresAt: String(rows[0].expires_at) };
    }
  }
  return null;
}

export type RedeemResult =
  | { ok: true; learner: LearnerRow }
  | { ok: false; reason: "invalid" | "expired" | "used" | "already_linked" };

/**
 * A signed-in kid redeems a code, linking their Clerk account to the learner
 * and promoting them to parent-verified (rung 2).
 *
 * This is the ONLY path to rung 2. The old client-side rule — "any 4-digit PIN
 * in localStorage means parent-verified" — let a kid promote themselves.
 */
export async function redeemClaimCode(code: string, clerkUserId: string): Promise<RedeemResult> {
  const sql = getSql();
  const rows = await sql`
    select c.code, c.learner_id, c.expires_at, c.used_at, l.clerk_user_id
    from claim_codes c
    join learners l on l.id = c.learner_id
    where c.code = ${code.trim().toUpperCase()}
    limit 1
  `;
  if (!rows.length) return { ok: false, reason: "invalid" };

  const row = rows[0];
  if (row.used_at) return { ok: false, reason: "used" };
  if (new Date(row.expires_at).getTime() < Date.now()) return { ok: false, reason: "expired" };
  if (row.clerk_user_id && row.clerk_user_id !== clerkUserId) {
    return { ok: false, reason: "already_linked" };
  }

  const updated = await sql`
    update learners
    set clerk_user_id = ${clerkUserId},
        verification_level = greatest(verification_level, 2)
    where id = ${row.learner_id}
    returning *
  `;
  await sql`
    update claim_codes set used_at = now(), used_by = ${clerkUserId}
    where code = ${row.code}
  `;
  await audit({
    parentId: null,
    learnerId: row.learner_id,
    event: "linked",
    actor: clerkUserId,
    detail: { via: "claim_code" },
  });

  return { ok: true, learner: toLearner(updated[0]) };
}

// ------------------------------------------------------------------ audit

export async function audit(input: {
  parentId: string | null;
  learnerId: string | null;
  event: string;
  actor?: string | null;
  detail?: unknown;
}): Promise<void> {
  const sql = getSql();
  await sql`
    insert into link_audit (parent_id, learner_id, event, actor, detail)
    values (${input.parentId}, ${input.learnerId}, ${input.event},
            ${input.actor ?? null}, ${JSON.stringify(input.detail ?? null)}::jsonb)
  `;
}
