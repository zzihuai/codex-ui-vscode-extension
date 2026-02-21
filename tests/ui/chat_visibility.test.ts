import { describe, expect, it } from "vitest";

import { shouldAutoReloadOnChatTabVisible } from "../../src/ui/chat_visibility";
import type { ChatViewState } from "../../src/ui/chat_view";

function makeState(overrides: Partial<ChatViewState>): ChatViewState {
  return {
    sessions: [],
    activeSession: null,
    unreadSessionIds: [],
    runningSessionIds: [],
    blocks: [],
    latestDiff: null,
    sending: false,
    reloading: false,
    approvals: [],
    ...overrides,
  };
}

describe("chat_visibility", () => {
  it("returns true only when active codez session has no loaded blocks", () => {
    const state = makeState({
      activeSession: {
        id: "s1",
        backendId: "codez",
        backendKey: "k1",
        workspaceFolderUri: "file:///repo",
        title: "t1",
        threadId: "th1",
      },
      blocks: [],
    });
    expect(shouldAutoReloadOnChatTabVisible(state)).toBe(true);
  });

  it("returns false for codex/opencode sessions", () => {
    const codexState = makeState({
      activeSession: {
        id: "s1",
        backendId: "codex",
        backendKey: "k1",
        workspaceFolderUri: "file:///repo",
        title: "t1",
        threadId: "th1",
      },
    });
    const opencodeState = makeState({
      activeSession: {
        id: "s2",
        backendId: "opencode",
        backendKey: "k2",
        workspaceFolderUri: "file:///repo",
        title: "t2",
        threadId: "th2",
      },
    });
    expect(shouldAutoReloadOnChatTabVisible(codexState)).toBe(false);
    expect(shouldAutoReloadOnChatTabVisible(opencodeState)).toBe(false);
  });

  it("returns false when sending/reloading/loaded", () => {
    const activeSession = {
      id: "s1",
      backendId: "codez" as const,
      backendKey: "k1",
      workspaceFolderUri: "file:///repo",
      title: "t1",
      threadId: "th1",
    };
    expect(
      shouldAutoReloadOnChatTabVisible(
        makeState({ activeSession, sending: true, blocks: [] }),
      ),
    ).toBe(false);
    expect(
      shouldAutoReloadOnChatTabVisible(
        makeState({ activeSession, reloading: true, blocks: [] }),
      ),
    ).toBe(false);
    expect(
      shouldAutoReloadOnChatTabVisible(
        makeState({
          activeSession,
          blocks: [{ id: "b1", type: "note", text: "loaded" }],
        }),
      ),
    ).toBe(false);
  });
});
