import { APICallError } from "ai";
import { describe, expect, it } from "vitest";
import { isProviderCredentialError } from "./provider-errors";

function apiError(statusCode: number) {
  return new APICallError({
    message: "provider request failed",
    url: "https://provider.example/v1/messages",
    requestBodyValues: {},
    statusCode,
  });
}

describe("isProviderCredentialError", () => {
  it.each([401, 402, 403])("classifies provider status %s as credential attention", (status) => {
    expect(isProviderCredentialError(apiError(status))).toBe(true);
  });

  it.each([400, 404, 408, 409, 422, 429, 500, 503])(
    "does not disable a credential for provider status %s",
    (status) => {
      expect(isProviderCredentialError(apiError(status))).toBe(false);
    },
  );

  it("finds an API error wrapped as a standard cause", () => {
    expect(isProviderCredentialError(new Error("wrapped", { cause: apiError(401) })))
      .toBe(true);
  });

  it("does not classify arbitrary messages or shapes", () => {
    expect(isProviderCredentialError(new Error("401 unauthorized"))).toBe(false);
    expect(isProviderCredentialError({ statusCode: 401 })).toBe(false);
    expect(isProviderCredentialError(null)).toBe(false);
  });
});
