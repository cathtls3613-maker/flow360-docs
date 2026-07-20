import { afterEach, describe, expect, it, vi } from "vitest";

import { logger } from "@/lib/logger";

describe("logger", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("writes info entries with message and context", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger.info("quotation created", { quotationId: "q-1" });
    expect(spy).toHaveBeenCalledTimes(1);
    const [message, context] = spy.mock.calls[0];
    expect(String(message)).toContain("quotation created");
    expect(context).toMatchObject({ quotationId: "q-1" });
  });

  it("routes errors to console.error", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    logger.error("pricing failed");
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("child loggers attach their context to every entry", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    const scoped = logger.child({ engine: "costing" });
    scoped.info("cost calculated", { itemId: "i-9" });
    const [, context] = spy.mock.calls[0];
    expect(context).toMatchObject({ engine: "costing", itemId: "i-9" });
  });
});
