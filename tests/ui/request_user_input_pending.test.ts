import { describe, expect, it, vi } from "vitest";

import { drainPendingRequestUserInput } from "../../src/ui/request_user_input_pending";

describe("drainPendingRequestUserInput", () => {
  it("cancels and clears all pending resolvers", () => {
    const first = vi.fn();
    const second = vi.fn();
    const pending = new Map<string, typeof first>([
      ["req-1", first],
      ["req-2", second],
    ]);

    drainPendingRequestUserInput(pending);

    expect(first).toHaveBeenCalledWith({ cancelled: true, answersById: {} });
    expect(second).toHaveBeenCalledWith({ cancelled: true, answersById: {} });
    expect(pending.size).toBe(0);
  });

  it("does nothing for empty pending map", () => {
    const pending = new Map();
    drainPendingRequestUserInput(pending);
    expect(pending.size).toBe(0);
  });
});
