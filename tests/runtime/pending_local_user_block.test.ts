import { describe, expect, it } from "vitest";

import {
  nextPendingLocalUserBlockIdOnSend,
  nextPendingLocalUserBlockIdOnTurnCompleted,
  resolvePendingLocalUserBlockBinding,
} from "../../src/runtime/pending_local_user_block";

describe("pending_local_user_block", () => {
  it("tracks pending local user block only for non-empty text", () => {
    expect(
      nextPendingLocalUserBlockIdOnSend({
        trimmedText: "hello",
        userBlockId: "user:1",
      }),
    ).toBe("user:1");

    expect(
      nextPendingLocalUserBlockIdOnSend({
        trimmedText: "",
        userBlockId: "user:2",
      }),
    ).toBeNull();
  });

  it("binds pending local user block when turn starts with id", () => {
    expect(
      resolvePendingLocalUserBlockBinding({
        activeTurnId: "turn-1",
        pendingLocalUserBlockId: "user:1",
      }),
    ).toEqual({
      blockIdToBind: "user:1",
      nextPendingLocalUserBlockId: null,
    });
  });

  it("keeps pending local user block when turn id is absent", () => {
    expect(
      resolvePendingLocalUserBlockBinding({
        activeTurnId: null,
        pendingLocalUserBlockId: "user:1",
      }),
    ).toEqual({
      blockIdToBind: null,
      nextPendingLocalUserBlockId: "user:1",
    });
  });

  it("clears pending local user block on turn completed", () => {
    expect(nextPendingLocalUserBlockIdOnTurnCompleted()).toBeNull();
  });
});
