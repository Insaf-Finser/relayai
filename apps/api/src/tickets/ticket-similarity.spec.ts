import { describe, expect, it } from "vitest";
import { calculateTicketSimilarity } from "./ticket-similarity.js";

describe("calculateTicketSimilarity", () => {
  it("returns 1 for identical text", () => {
    expect(
      calculateTicketSimilarity(
        "Login problem",
        "Login problem",
      ),
    ).toBe(1);
  });

  it("ignores differences in capitalization", () => {
    expect(
      calculateTicketSimilarity(
        "LOGIN PROBLEM",
        "login problem",
      ),
    ).toBe(1);
  });

  it("ignores punctuation", () => {
    expect(
      calculateTicketSimilarity(
        "Login problem!",
        "Login, problem.",
      ),
    ).toBe(1);
  });

  it("returns a score between 0 and 1 for partially similar text", () => {
    const score = calculateTicketSimilarity(
      "Cannot login to my account",
      "Cannot access my account",
    );

    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(1);
  });

  it("returns 0 when there are no matching words", () => {
    expect(
      calculateTicketSimilarity(
        "Payment failed",
        "Weather forecast",
      ),
    ).toBe(0);
  });

  it("returns 0 when both inputs are empty", () => {
    expect(calculateTicketSimilarity("", "")).toBe(0);
  });
});