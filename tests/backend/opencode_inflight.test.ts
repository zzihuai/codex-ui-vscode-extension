import { describe, expect, it, vi } from "vitest";

import { withInFlightReset } from "../../src/backend/opencode_inflight";

describe("withInFlightReset", () => {
  it("resets in-flight marker on success", async () => {
    const onSettled = vi.fn();
    const result = await withInFlightReset(Promise.resolve("ok"), onSettled);

    expect(result).toBe("ok");
    expect(onSettled).toHaveBeenCalledTimes(1);
  });

  it("resets in-flight marker on failure", async () => {
    const onSettled = vi.fn();
    await expect(
      withInFlightReset(Promise.reject(new Error("boom")), onSettled),
    ).rejects.toThrow("boom");

    expect(onSettled).toHaveBeenCalledTimes(1);
  });
});
