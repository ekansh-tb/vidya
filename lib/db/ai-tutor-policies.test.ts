import { describe, expect, it } from "vitest";
import {
  aiTutorProfileSummaryFromRow,
  learnerAiAssignmentSummaryFromRow,
} from "./ai-tutor-policies";

const profileRow = {
  id: "11111111-1111-4111-8111-111111111111",
  parent_id: "parent-private",
  name: "Science Guide",
  connection_id: "22222222-2222-4222-8222-222222222222",
  connection_label: "Family OpenRouter",
  provider: "openrouter",
  connection_status: "active",
  model_id: "anthropic/claude-haiku-4.5",
  credential_ciphertext: "never-public",
  created_at: "2026-08-16T10:00:00.000Z",
  updated_at: "2026-08-16T10:00:00.000Z",
};

describe("AI tutor policy persistence shapes", () => {
  it("maps a tutor profile without parent or credential fields", () => {
    const profile = aiTutorProfileSummaryFromRow(profileRow);
    expect(profile).toEqual({
      id: profileRow.id,
      name: "Science Guide",
      connectionId: profileRow.connection_id,
      connectionLabel: "Family OpenRouter",
      provider: "openrouter",
      connectionStatus: "active",
      modelId: "anthropic/claude-haiku-4.5",
      createdAt: profileRow.created_at,
      updatedAt: profileRow.updated_at,
    });
    expect(JSON.stringify(profile)).not.toContain("parent-private");
    expect(JSON.stringify(profile)).not.toContain("never-public");
  });

  it("fails closed for an unsupported provider, status, or model id", () => {
    expect(() => aiTutorProfileSummaryFromRow({ ...profileRow, provider: "unknown" }))
      .toThrow(/unsupported AI provider/);
    expect(() => aiTutorProfileSummaryFromRow({ ...profileRow, connection_status: "deleted" }))
      .toThrow(/invalid AI connection status/);
    expect(() => aiTutorProfileSummaryFromRow({ ...profileRow, model_id: "model with spaces" }))
      .toThrow(/invalid tutor model id/);
  });

  it("maps bounded learner controls and rejects values beyond global ceilings", () => {
    const assignment = learnerAiAssignmentSummaryFromRow({
      learner_id: "33333333-3333-4333-8333-333333333333",
      parent_id: "parent-private",
      tutor_profile_id: profileRow.id,
      enabled: true,
      daily_turn_limit: 24,
      max_output_tokens: 600,
      created_at: profileRow.created_at,
      updated_at: profileRow.updated_at,
    });
    expect(assignment).toMatchObject({
      enabled: true,
      dailyTurnLimit: 24,
      maxOutputTokens: 600,
    });
    expect(JSON.stringify(assignment)).not.toContain("parent-private");
    expect(() => learnerAiAssignmentSummaryFromRow({
      learner_id: "33333333-3333-4333-8333-333333333333",
      tutor_profile_id: profileRow.id,
      enabled: true,
      daily_turn_limit: 61,
      max_output_tokens: 900,
      created_at: profileRow.created_at,
      updated_at: profileRow.updated_at,
    })).toThrow(/invalid tutor limits/);
    expect(() => learnerAiAssignmentSummaryFromRow({
      learner_id: "33333333-3333-4333-8333-333333333333",
      tutor_profile_id: profileRow.id,
      enabled: "true",
      daily_turn_limit: 60,
      max_output_tokens: 900,
      created_at: profileRow.created_at,
      updated_at: profileRow.updated_at,
    })).toThrow(/invalid tutor enabled state/);
  });
});
