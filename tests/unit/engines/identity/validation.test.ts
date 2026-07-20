import { describe, expect, it } from "vitest";

import { signInSchema, signUpSchema } from "@/engines/identity";
import { parseOrThrow } from "@/engines/identity/domain/validation";
import { ValidationError } from "@/lib/errors";

const validSignUp = {
  fullName: "Sara Pumpexpert",
  companyName: "Gulf Flow Equipment",
  email: "sara@gulfflow.example",
  password: "correct-horse-battery",
};

describe("signUpSchema", () => {
  it("accepts a valid workspace sign-up", () => {
    expect(signUpSchema.safeParse(validSignUp).success).toBe(true);
  });

  it("trims surrounding whitespace from names", () => {
    const parsed = signUpSchema.parse({
      ...validSignUp,
      fullName: "  Sara Pumpexpert  ",
      companyName: "  Gulf Flow Equipment ",
    });
    expect(parsed.fullName).toBe("Sara Pumpexpert");
    expect(parsed.companyName).toBe("Gulf Flow Equipment");
  });

  it.each([
    ["fullName", { fullName: "" }],
    ["companyName", { companyName: "   " }],
    ["email", { email: "not-an-email" }],
    ["password", { password: "short" }],
  ])("rejects an invalid %s", (_field, override) => {
    expect(
      signUpSchema.safeParse({ ...validSignUp, ...override }).success,
    ).toBe(false);
  });
});

describe("signInSchema", () => {
  it("accepts valid credentials", () => {
    expect(
      signInSchema.safeParse({ email: "a@b.example", password: "x" }).success,
    ).toBe(true);
  });

  it("rejects a missing password", () => {
    expect(
      signInSchema.safeParse({ email: "a@b.example", password: "" }).success,
    ).toBe(false);
  });
});

describe("parseOrThrow", () => {
  it("returns parsed data for valid input", () => {
    expect(
      parseOrThrow(signInSchema, { email: "a@b.example", password: "x" }),
    ).toEqual({ email: "a@b.example", password: "x" });
  });

  it("throws ValidationError with per-field details for invalid input", () => {
    try {
      parseOrThrow(signUpSchema, { ...validSignUp, email: "nope" });
      expect.unreachable("should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      const validationError = error as ValidationError;
      expect(validationError.details).toMatchObject({
        fieldErrors: { email: "Please enter a valid email address." },
      });
    }
  });
});
