import { describe, expect, it } from "vitest";
import {
  isDeletedAiTutorProfile,
  parseAiTutorModelsResponse,
  parseAiTutorProfilesResponse,
  parseCreatedAiTutorProfile,
  parseLearnerAiAssignmentDeletion,
  parseLearnerAiAssignmentResponse,
  parseLearnerAiAssignmentSummary,
} from "./tutor-profile-summary";

const profile = {
  id: "11111111-1111-4111-8111-111111111111",
  name: "Science Guide",
  connectionId: "22222222-2222-4222-8222-222222222222",
  connectionLabel: "Family OpenRouter",
  provider: "openrouter",
  connectionStatus: "active",
  modelId: "anthropic/claude-haiku-4.5",
  createdAt: "2026-08-16T10:00:00.000Z",
  updatedAt: "2026-08-16T10:00:00.000Z",
};

describe("AI tutor profile response parsing", () => {
  it("constructs a public profile and drops unexpected private fields", () => {
    const parsed = parseAiTutorProfilesResponse({
      profiles: [{
        ...profile,
        parentId: "parent-private",
        credentialCiphertext: "encrypted-private",
      }],
    });
    expect(parsed).toEqual([profile]);
    expect(JSON.stringify(parsed)).not.toContain("parent-private");
    expect(JSON.stringify(parsed)).not.toContain("encrypted-private");
    expect(parseCreatedAiTutorProfile({ profile })).toEqual(profile);
  });

  it("rejects a malformed profile response", () => {
    expect(parseAiTutorProfilesResponse({
      profiles: [profile, { ...profile, modelId: "model with spaces" }],
    })).toBeNull();
    expect(parseAiTutorProfilesResponse({ profiles: "not-an-array" })).toBeNull();
  });

  it("parses learner controls only within the allowed limits", () => {
    const assignment = {
      learnerId: "33333333-3333-4333-8333-333333333333",
      tutorProfileId: profile.id,
      enabled: false,
      dailyTurnLimit: 20,
      maxOutputTokens: 500,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
    expect(parseLearnerAiAssignmentSummary({
      ...assignment,
      parentId: "parent-private",
    })).toEqual(assignment);
    expect(parseLearnerAiAssignmentSummary({
      ...assignment,
      dailyTurnLimit: 61,
    })).toBeNull();
    expect(parseLearnerAiAssignmentResponse({ assignment })).toEqual(assignment);
    expect(parseLearnerAiAssignmentResponse({ assignment: null })).toBeNull();
    expect(parseLearnerAiAssignmentResponse({ assignment: { ...assignment, enabled: "yes" } }))
      .toBeUndefined();
  });

  it("parses a bounded, unique model catalog", () => {
    const payload = {
      provider: "openrouter",
      models: [
        { id: "anthropic/claude-haiku-4.5", name: "Claude Haiku 4.5" },
        { id: "openai/gpt-5-mini", name: "GPT-5 mini" },
      ],
      truncated: false,
    };
    expect(parseAiTutorModelsResponse(payload)).toEqual(payload);
    expect(parseAiTutorModelsResponse({ ...payload, provider: "unknown" })).toBeNull();
    expect(parseAiTutorModelsResponse({
      ...payload,
      models: [...payload.models, payload.models[0]],
    })).toBeNull();
    expect(parseAiTutorModelsResponse({
      ...payload,
      models: [{ id: "model with spaces", name: "Bad" }],
    })).toBeNull();
    expect(parseAiTutorModelsResponse({
      ...payload,
      models: Array.from({ length: 501 }, (_, index) => ({
        id: `model-${index}`,
        name: `Model ${index}`,
      })),
    })).toBeNull();
  });

  it("parses tutor deletion without accepting loose truthy values", () => {
    expect(isDeletedAiTutorProfile({ deleted: true })).toBe(true);
    expect(isDeletedAiTutorProfile({ deleted: "true" })).toBe(false);
  });

  it("parses learner assignment deletion as an explicit boolean", () => {
    expect(parseLearnerAiAssignmentDeletion({ deleted: true })).toBe(true);
    expect(parseLearnerAiAssignmentDeletion({ deleted: false })).toBe(false);
    expect(parseLearnerAiAssignmentDeletion({ deleted: "false" })).toBeNull();
  });
});
