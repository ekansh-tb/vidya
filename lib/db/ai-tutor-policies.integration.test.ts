/**
 * Integration checks for parent-owned tutor profiles and learner assignments.
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
  setAiConnectionStatusForParent,
} from "./ai-connections";
import {
  createAiTutorProfileForParent,
  deleteAiTutorProfileForParent,
  getLearnerAiAssignmentForParent,
  getLearnerAiTutorRuntimePolicy,
  listAiTutorProfilesForParent,
  removeLearnerAiAssignmentForParent,
  setLearnerAiAssignmentForParent,
} from "./ai-tutor-policies";
import { createLearner, upsertParent } from "./queries";

const hasDb = dbConfigured();
const d = hasDb ? describe : describe.skip;
const RUN = `ai-tutor-itest-${Date.now()}`;
const PARENT_A = `${RUN}-parent-a`;
const PARENT_B = `${RUN}-parent-b`;
const CONNECTION_A = randomUUID();
const CONNECTION_B = randomUUID();
const PROFILE_A = randomUUID();
const PROFILE_B = randomUUID();
let learnerA = "";
let learnerB = "";

const encrypted = (value: string): EncryptedCredential => ({
  ciphertext: Buffer.from(value).toString("base64"),
  iv: Buffer.alloc(12, 1).toString("base64"),
  tag: Buffer.alloc(16, 2).toString("base64"),
  keyVersion: "v1",
});

d("AI tutor policy database isolation", { timeout: DB_TIMEOUT_MS }, () => {
  beforeAll(async () => {
    await upsertParent({ id: PARENT_A });
    await upsertParent({ id: PARENT_B });
    learnerA = (await createLearner({
      parentId: PARENT_A,
      name: "Learner A",
      grade: 5,
      board: "cambridge-primary",
    })).id;
    learnerB = (await createLearner({
      parentId: PARENT_B,
      name: "Learner B",
      grade: 7,
      board: "icse",
    })).id;
    await createAiConnectionForParent({
      id: CONNECTION_A,
      parentId: PARENT_A,
      actorId: PARENT_A,
      provider: "openrouter",
      label: `${RUN} OpenRouter A`,
      source: "oauth",
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
      label: `${RUN} Anthropic B`,
      source: "api_key",
      status: "active",
      encryptedCredential: encrypted("parent-b-secret"),
      credentialFingerprint: "b".repeat(64),
      credentialHint: "cret",
    });
    await createAiTutorProfileForParent({
      id: PROFILE_A,
      parentId: PARENT_A,
      actorId: PARENT_A,
      connectionId: CONNECTION_A,
      name: `${RUN} Tutor A`,
      modelId: "anthropic/claude-haiku-4.5",
    });
    await createAiTutorProfileForParent({
      id: PROFILE_B,
      parentId: PARENT_B,
      actorId: PARENT_B,
      connectionId: CONNECTION_B,
      name: `${RUN} Tutor B`,
      modelId: "claude-haiku-4-5",
    });
  }, DB_TIMEOUT_MS);

  afterAll(async () => {
    if (!hasDb) return;
    const sql = getSql();
    await sql`delete from parents where id in (${PARENT_A}, ${PARENT_B})`;
  }, DB_TIMEOUT_MS);

  it("lists only tutor profiles owned by the signed-in parent", async () => {
    const profiles = await listAiTutorProfilesForParent(PARENT_A);
    expect(profiles.map((profile) => profile.id)).toContain(PROFILE_A);
    expect(profiles.map((profile) => profile.id)).not.toContain(PROFILE_B);
    expect(JSON.stringify(profiles)).not.toContain("parent-a-secret");
  });

  it("does not create a tutor profile from another parent's connection", async () => {
    expect(await createAiTutorProfileForParent({
      id: randomUUID(),
      parentId: PARENT_A,
      actorId: PARENT_A,
      connectionId: CONNECTION_B,
      name: `${RUN} Stolen connection`,
      modelId: "claude-haiku-4-5",
    })).toBeNull();
  });

  it("does not assign another parent's learner or tutor profile", async () => {
    expect(await setLearnerAiAssignmentForParent({
      parentId: PARENT_A,
      actorId: PARENT_A,
      learnerId: learnerB,
      tutorProfileId: PROFILE_A,
      enabled: true,
      dailyTurnLimit: 20,
      maxOutputTokens: 500,
    })).toBeNull();
    expect(await setLearnerAiAssignmentForParent({
      parentId: PARENT_A,
      actorId: PARENT_A,
      learnerId: learnerA,
      tutorProfileId: PROFILE_B,
      enabled: true,
      dailyTurnLimit: 20,
      maxOutputTokens: 500,
    })).toBeNull();
  });

  it("stores bounded controls for an owned learner and tutor profile", async () => {
    expect(await setLearnerAiAssignmentForParent({
      parentId: PARENT_A,
      actorId: PARENT_A,
      learnerId: learnerA,
      tutorProfileId: PROFILE_A,
      enabled: true,
      dailyTurnLimit: 24,
      maxOutputTokens: 600,
    })).toMatchObject({
      learnerId: learnerA,
      tutorProfileId: PROFILE_A,
      enabled: true,
      dailyTurnLimit: 24,
      maxOutputTokens: 600,
    });
    expect(await getLearnerAiAssignmentForParent(PARENT_B, learnerA)).toBeNull();
    expect(await getLearnerAiAssignmentForParent(PARENT_A, learnerA))
      .toMatchObject({ enabled: true, dailyTurnLimit: 24 });
  });

  it("rejects limits beyond the global tutor ceilings", async () => {
    await expect(setLearnerAiAssignmentForParent({
      parentId: PARENT_A,
      actorId: PARENT_A,
      learnerId: learnerA,
      tutorProfileId: PROFILE_A,
      enabled: true,
      dailyTurnLimit: 61,
      maxOutputTokens: 900,
    })).rejects.toThrow();
  });

  it("resolves only the authenticated learner's enabled runtime policy", async () => {
    expect(await getLearnerAiTutorRuntimePolicy(learnerA)).toMatchObject({
      learnerId: learnerA,
      parentId: PARENT_A,
      tutorProfileId: PROFILE_A,
      connectionId: CONNECTION_A,
      provider: "openrouter",
      modelId: "anthropic/claude-haiku-4.5",
      dailyTurnLimit: 24,
      maxOutputTokens: 600,
    });
    expect(await getLearnerAiTutorRuntimePolicy(learnerB)).toBeNull();
  });

  it("does not enable a tutor when its provider connection needs attention", async () => {
    await setAiConnectionStatusForParent(
      PARENT_A,
      CONNECTION_A,
      "needs_attention",
      PARENT_A,
    );
    try {
      expect(await getLearnerAiTutorRuntimePolicy(learnerA)).toBeNull();
      expect(await setLearnerAiAssignmentForParent({
        parentId: PARENT_A,
        actorId: PARENT_A,
        learnerId: learnerA,
        tutorProfileId: PROFILE_A,
        enabled: true,
        dailyTurnLimit: 24,
        maxOutputTokens: 600,
      })).toBeNull();
      expect(await setLearnerAiAssignmentForParent({
        parentId: PARENT_A,
        actorId: PARENT_A,
        learnerId: learnerA,
        tutorProfileId: PROFILE_A,
        enabled: false,
        dailyTurnLimit: 24,
        maxOutputTokens: 600,
      })).toMatchObject({ enabled: false });
    } finally {
      await setAiConnectionStatusForParent(
        PARENT_A,
        CONNECTION_A,
        "active",
        PARENT_A,
      );
      await setLearnerAiAssignmentForParent({
        parentId: PARENT_A,
        actorId: PARENT_A,
        learnerId: learnerA,
        tutorProfileId: PROFILE_A,
        enabled: true,
        dailyTurnLimit: 24,
        maxOutputTokens: 600,
      });
    }
  });

  it("does not remove another parent's assignment or tutor profile", async () => {
    expect(await removeLearnerAiAssignmentForParent(PARENT_B, learnerA, PARENT_B)).toBe(false);
    expect(await deleteAiTutorProfileForParent(PARENT_B, PROFILE_A, PARENT_B)).toBe(false);
    expect(await getLearnerAiAssignmentForParent(PARENT_A, learnerA)).not.toBeNull();
  });

  it("records policy changes without credential material", async () => {
    const sql = getSql();
    const rows = await sql`
      select event, detail from ai_tutor_policy_audit
      where parent_id = ${PARENT_A}
      order by created_at asc
    `;
    expect(rows.map((row) => row.event)).toContain("profile_created");
    expect(rows.map((row) => row.event)).toContain("assignment_set");
    expect(JSON.stringify(rows)).not.toContain("parent-a-secret");
  });

  it("lets the owner remove an assignment and profile", async () => {
    expect(await removeLearnerAiAssignmentForParent(PARENT_A, learnerA, PARENT_A)).toBe(true);
    expect(await getLearnerAiAssignmentForParent(PARENT_A, learnerA)).toBeNull();
    expect(await deleteAiTutorProfileForParent(PARENT_A, PROFILE_A, PARENT_A)).toBe(true);
  });
});

(hasDb ? describe.skip : describe)("AI tutor policy database integration (skipped)", () => {
  it("requires DATABASE_URL and migration 0007", () => {
    expect(hasDb).toBe(false);
  });
});
