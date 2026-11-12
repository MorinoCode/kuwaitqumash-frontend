import { describe, it, expect } from "vitest";
import {
  handleApiError,
  getErrorDetails,
  isNetworkError,
  isAuthError,
} from "./errorHandler";

describe("handleApiError", () => {
  it("explains network failures", () => {
    expect(handleApiError({ code: "ERR_NETWORK" })).toMatch(/Network error/);
  });

  it("explains timeouts", () => {
    expect(handleApiError({ message: "timeout of 30000ms exceeded" })).toMatch(
      /timeout/i,
    );
  });

  it("uses the server message for a 400", () => {
    expect(
      handleApiError({ response: { status: 400, data: { message: "Bad input" } } }),
    ).toBe("Bad input");
  });

  it("asks for a new login on 401", () => {
    expect(handleApiError({ response: { status: 401 } })).toMatch(/Session expired/);
  });

  it("explains 403 as a permission problem", () => {
    expect(handleApiError({ response: { status: 403 } })).toMatch(/Access denied/);
  });

  it("explains 429 as rate limiting", () => {
    expect(handleApiError({ response: { status: 429 } })).toMatch(/Too many requests/);
  });

  it("explains a 500 as a server error", () => {
    expect(handleApiError({ response: { status: 500 } })).toMatch(/Server error/);
  });

  it("falls back when there is no error object", () => {
    expect(handleApiError(null)).toMatch(/unexpected error/i);
  });
});

describe("getErrorDetails", () => {
  it("returns null without an error", () => {
    expect(getErrorDetails(null)).toBeNull();
  });

  it("collects status, url and method", () => {
    expect(
      getErrorDetails({
        message: "failed",
        response: { status: 400, statusText: "Bad Request", data: { a: 1 } },
        config: { url: "/api/x", method: "post" },
      }),
    ).toEqual({
      message: "failed",
      code: undefined,
      status: 400,
      statusText: "Bad Request",
      data: { a: 1 },
      url: "/api/x",
      method: "post",
    });
  });
});

describe("error classifiers", () => {
  it("detects network and timeout errors", () => {
    expect(isNetworkError({ code: "ERR_NETWORK" })).toBe(true);
    expect(isNetworkError({ code: "ECONNABORTED" })).toBe(true);
    expect(isNetworkError({ code: "OTHER" })).toBe(false);
  });

  it("detects auth errors", () => {
    expect(isAuthError({ response: { status: 401 } })).toBe(true);
    expect(isAuthError({ response: { status: 403 } })).toBe(true);
    expect(isAuthError({ response: { status: 500 } })).toBe(false);
  });
});
