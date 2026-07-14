/**
 * Error handling strategy.
 *
 * All errors the application raises on purpose extend `AppError`. They
 * carry a stable machine-readable `code`, an HTTP status, and optional
 * structured `details` — so API responses, logs, and the UI can all
 * treat errors consistently.
 *
 * "Operational" errors are expected business situations (validation
 * failed, record not found, no permission). They are safe to show to
 * users. Anything else is a programmer error or infrastructure failure:
 * it gets logged with full detail and users see only a generic message.
 */

export class AppError extends Error {
  /** Stable machine-readable identifier, e.g. "NOT_FOUND". */
  readonly code: string;
  /** HTTP status this error maps to when it crosses an API boundary. */
  readonly statusCode: number;
  /** True when the error is an expected business outcome, safe to display. */
  readonly isOperational: boolean;
  /** Structured extra information (e.g. which field failed validation). */
  readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    options: {
      code?: string;
      statusCode?: number;
      isOperational?: boolean;
      details?: Record<string, unknown>;
      cause?: unknown;
    } = {},
  ) {
    super(message, { cause: options.cause });
    this.name = this.constructor.name;
    this.code = options.code ?? "INTERNAL_ERROR";
    this.statusCode = options.statusCode ?? 500;
    this.isOperational = options.isOperational ?? false;
    this.details = options.details;
  }
}

/** Input failed validation (bad form data, malformed request). */
export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, {
      code: "VALIDATION_ERROR",
      statusCode: 400,
      isOperational: true,
      details,
    });
  }
}

/** The requested record does not exist (or belongs to another company). */
export class NotFoundError extends AppError {
  constructor(message = "The requested resource was not found.") {
    super(message, {
      code: "NOT_FOUND",
      statusCode: 404,
      isOperational: true,
    });
  }
}

/** The caller is not signed in. */
export class UnauthorizedError extends AppError {
  constructor(message = "You must be signed in to do this.") {
    super(message, {
      code: "UNAUTHORIZED",
      statusCode: 401,
      isOperational: true,
    });
  }
}

/** The caller is signed in but lacks permission. */
export class ForbiddenError extends AppError {
  constructor(message = "You do not have permission to do this.") {
    super(message, {
      code: "FORBIDDEN",
      statusCode: 403,
      isOperational: true,
    });
  }
}

/** The action conflicts with current state (e.g. duplicate record). */
export class ConflictError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, {
      code: "CONFLICT",
      statusCode: 409,
      isOperational: true,
      details,
    });
  }
}

/**
 * Converts any thrown value into an `AppError` so upstream code only
 * ever deals with one error shape.
 */
export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }
  if (error instanceof Error) {
    return new AppError(error.message, { cause: error });
  }
  return new AppError("An unknown error occurred.", {
    details: { thrown: String(error) },
  });
}

/** Message shown to users when an unexpected (non-operational) error occurs. */
export const GENERIC_ERROR_MESSAGE =
  "Something went wrong on our side. Please try again — if it keeps happening, contact support.";

/** Returns a message that is always safe to display to end users. */
export function getUserFacingMessage(error: unknown): string {
  const normalized = normalizeError(error);
  return normalized.isOperational ? normalized.message : GENERIC_ERROR_MESSAGE;
}
