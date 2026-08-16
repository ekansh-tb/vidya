import { describe, expect, it } from "vitest";
import {
  parseAiTutorProfilesResponse,
  parseCreatedAiTutorProfile,
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
});
