import { describe, it, expect, beforeEach } from "vitest";
import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  clearAuthStorage,
  getMultipleStorageItems,
  setMultipleStorageItems,
} from "./storage";

beforeEach(() => {
  localStorage.clear();
});

describe("storage helpers", () => {
  it("returns the default for a missing key", () => {
    expect(getStorageItem("missing", "fallback")).toBe("fallback");
  });

  it("round-trips a JSON value", () => {
    setStorageItem("user", { id: 1 });
    expect(getStorageItem("user")).toEqual({ id: 1 });
  });

  it("returns raw text when the value is not JSON", () => {
    localStorage.setItem("token", "abc");
    expect(getStorageItem("token")).toBe("abc");
  });

  it("removes a key", () => {
    setStorageItem("temp", 1);
    expect(removeStorageItem("temp")).toBe(true);
    expect(getStorageItem("temp")).toBeNull();
  });

  it("clears only auth keys", () => {
    setStorageItem("token", "t");
    setStorageItem("user_data", { id: 1 });
    setStorageItem("theme", "dark");
    clearAuthStorage();
    expect(getStorageItem("token")).toBeNull();
    expect(getStorageItem("user_data")).toBeNull();
    expect(getStorageItem("theme")).toBe("dark");
  });

  it("reads and writes several keys at once", () => {
    expect(setMultipleStorageItems({ a: 1, b: "two" })).toBe(true);
    expect(getMultipleStorageItems(["a", "b", "c"])).toEqual({
      a: 1,
      b: "two",
      c: null,
    });
  });
});
