/**
 * Structured logging framework.
 *
 * Rules for the whole codebase:
 *   - Never call `console.log` directly. Import `logger` and use it.
 *   - Log objects, not interpolated strings: the `context` argument is
 *     machine-readable, which makes logs searchable in production.
 *   - Never log secrets, tokens, or full request bodies.
 *
 * Output is pretty-printed in development and JSON in production, so a
 * log aggregation service (and later Sentry) can index every field.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogContext = Record<string, unknown>;

const LEVEL_WEIGHT: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const MIN_LEVEL: LogLevel =
  process.env.NODE_ENV === "production" ? "info" : "debug";

function write(level: LogLevel, message: string, context?: LogContext) {
  if (LEVEL_WEIGHT[level] < LEVEL_WEIGHT[MIN_LEVEL]) {
    return;
  }

  const entry = {
    level,
    time: new Date().toISOString(),
    message,
    ...context,
  };

  // console.warn / console.error map to stderr on the server and are
  // highlighted in browser devtools; everything else goes to stdout.
  const sink =
    level === "error"
      ? console.error
      : level === "warn"
        ? console.warn
        : // eslint-disable-next-line no-console -- single sanctioned console sink
          console.log;

  if (process.env.NODE_ENV === "production") {
    sink(JSON.stringify(entry));
  } else {
    sink(`[${entry.time}] ${level.toUpperCase()}: ${message}`, context ?? "");
  }
}

export interface Logger {
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, context?: LogContext): void;
  /** Returns a logger that automatically attaches `context` to every entry. */
  child(context: LogContext): Logger;
}

function createLogger(base: LogContext = {}): Logger {
  const merge = (context?: LogContext) => ({ ...base, ...context });

  return {
    debug: (message, context) => write("debug", message, merge(context)),
    info: (message, context) => write("info", message, merge(context)),
    warn: (message, context) => write("warn", message, merge(context)),
    error: (message, context) => write("error", message, merge(context)),
    child: (context) => createLogger(merge(context)),
  };
}

/** Application-wide logger. Create scoped loggers with `logger.child(...)`. */
export const logger = createLogger();
