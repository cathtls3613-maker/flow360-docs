import { describe, expect, it } from "vitest";

import {
  AppError,
  ConflictError,
  ForbiddenError,
  GENERIC_ERROR_MESSAGE,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
  getUserFacingMessage,
  normalizeError,
} from "@/lib/errors";

describe("AppError hierarchy", () => {
  it("defaults to a non-operational internal error", () => {
    const error = new AppError("boom");
    expect(error.code).toBe("INTERNAL_ERROR");
    expect(error.statusCode).toBe(500);
    expect(error.isOperational).toBe(false);
  });

  it.each([
    [new ValidationError("bad input"), "VALIDATION_ERROR", 400],
    [new NotFoundError(), "NOT_FOUND", 404],
    [new UnauthorizedError(), "UNAUTHORIZED", 401],
    [new ForbiddenError(), "FORBIDDEN", 403],
    [new ConflictError("duplicate"), "CONFLICT", 409],
  ] as const)("maps %s to code %s and status %i", (error, code, statusCode) => {
    expect(error.code).toBe(code);
    expect(error.statusCode).toBe(statusCode);
    expect(error.isOperational).toBe(true);
  });

  it("carries structured details", () => {
    const error = new ValidationError("bad input", { field: "email" });
    expect(error.details).toEqual({ field: "email" });
  });
});

describe("normalizeError", () => {
  it("returns AppError instances unchanged", () => {
    const original = new NotFoundError();
    expect(normalizeError(original)).toBe(original);
  });

  it("wraps plain Error and preserves it as cause", () => {
    const original = new Error("db exploded");
    const normalized = normalizeError(original);
    expect(normalized).toBeInstanceOf(AppError);
    expect(normalized.message).toBe("db exploded");
    expect(normalized.cause).toBe(original);
    expect(normalized.isOperational).toBe(false);
  });

  it("wraps non-Error values", () => {
    const normalized = normalizeError("just a string");
    expect(normalized).toBeInstanceOf(AppError);
    expect(normalized.details).toEqual({ thrown: "just a string" });
  });
});

describe("getUserFacingMessage", () => {
  it("shows operational error messages to users", () => {
    expect(
      getUserFacingMessage(new ValidationError("Price is required.")),
    ).toBe("Price is required.");
  });

  it("hides unexpected error internals from users", () => {
    expect(getUserFacingMessage(new Error("connection refused 10.0.0.5"))).toBe(
      GENERIC_ERROR_MESSAGE,
    );
  });
});
