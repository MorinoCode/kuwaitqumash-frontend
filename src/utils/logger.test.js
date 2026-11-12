import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import log, { log as info, error, warn, debug } from "./logger";

describe("logger", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "debug").mockImplementation(() => {});
  });

  afterEach(() => vi.restoreAllMocks());

  it("exposes a default object with every level", () => {
    expect(Object.keys(log).sort()).toEqual(["debug", "error", "info", "log", "warn"]);
  });

  it("forwards to console in development", () => {
    info("hello");
    error("boom");
    warn("careful");
    debug("trace");

    if (import.meta.env.DEV) {
      expect(console.log).toHaveBeenCalledWith("hello");
      expect(console.error).toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalled();
      expect(console.debug).toHaveBeenCalled();
    }
  });
});
