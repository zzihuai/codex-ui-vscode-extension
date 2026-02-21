import { describe, expect, it } from "vitest";

import {
  canReopenToBackend,
  evaluateReloadSessionGuard,
  evaluateReopenSessionAction,
  parseReopenCommandArgs,
  REOPEN_INCOMPATIBLE_MESSAGE,
  RELOAD_SENDING_MESSAGE,
  RELOAD_OTHER_SESSION_RUNNING_MESSAGE,
  RELOAD_UNSUPPORTED_MESSAGE,
  RELOAD_WORKSPACE_MISSING_MESSAGE,
} from "../../src/commands/session_actions";

describe("session_actions", () => {
  it("parses valid reopen command args", () => {
    expect(
      parseReopenCommandArgs({ sessionId: "s1", backendId: "codez" }),
    ).toEqual({
      sessionId: "s1",
      backendId: "codez",
    });
  });

  it("rejects invalid reopen command args", () => {
    expect(parseReopenCommandArgs(null)).toBeNull();
    expect(parseReopenCommandArgs({})).toBeNull();
    expect(
      parseReopenCommandArgs({ sessionId: "s1", backendId: "unknown" }),
    ).toBeNull();
  });

  it("allows reopen only in codex/codez family", () => {
    expect(canReopenToBackend("codex", "codez")).toEqual({ ok: true });
    expect(canReopenToBackend("codez", "codex")).toEqual({ ok: true });
    expect(canReopenToBackend("opencode", "codex")).toEqual({
      ok: false,
      message: REOPEN_INCOMPATIBLE_MESSAGE,
    });
    expect(canReopenToBackend("codez", "opencode")).toEqual({
      ok: false,
      message: REOPEN_INCOMPATIBLE_MESSAGE,
    });
  });

  it("decides reopen action from compatibility and existing session", () => {
    expect(
      evaluateReopenSessionAction({
        sourceBackendId: "codez",
        targetBackendId: "codex",
        existingSessionId: "existing-1",
      }),
    ).toEqual({ ok: true, action: "reuseExisting" });
    expect(
      evaluateReopenSessionAction({
        sourceBackendId: "codez",
        targetBackendId: "codex",
        existingSessionId: null,
      }),
    ).toEqual({ ok: true, action: "createNew" });
    expect(
      evaluateReopenSessionAction({
        sourceBackendId: "opencode",
        targetBackendId: "codex",
        existingSessionId: "existing-2",
      }),
    ).toEqual({
      ok: false,
      message: REOPEN_INCOMPATIBLE_MESSAGE,
    });
  });

  it("evaluates reload guard for unsupported backend", () => {
    expect(
      evaluateReloadSessionGuard({
        backendId: "codex",
        hasWorkspaceFolder: true,
        sending: false,
        reloading: false,
        hasOtherRunningSession: false,
      }),
    ).toEqual({
      ok: false,
      kind: "info",
      message: RELOAD_UNSUPPORTED_MESSAGE,
    });
  });

  it("evaluates reload guard for missing workspace", () => {
    expect(
      evaluateReloadSessionGuard({
        backendId: "codez",
        hasWorkspaceFolder: false,
        sending: false,
        reloading: false,
        hasOtherRunningSession: false,
      }),
    ).toEqual({
      ok: false,
      kind: "error",
      message: RELOAD_WORKSPACE_MISSING_MESSAGE,
    });
  });

  it("evaluates reload guard for sending and reloading", () => {
    expect(
      evaluateReloadSessionGuard({
        backendId: "codez",
        hasWorkspaceFolder: true,
        sending: true,
        reloading: false,
        hasOtherRunningSession: false,
      }),
    ).toEqual({
      ok: false,
      kind: "error",
      message: RELOAD_SENDING_MESSAGE,
    });
    expect(
      evaluateReloadSessionGuard({
        backendId: "codez",
        hasWorkspaceFolder: true,
        sending: false,
        reloading: true,
        hasOtherRunningSession: false,
      }),
    ).toEqual({
      ok: false,
      kind: "silent",
      message: null,
    });
  });

  it("evaluates reload guard for other running session", () => {
    expect(
      evaluateReloadSessionGuard({
        backendId: "codez",
        hasWorkspaceFolder: true,
        sending: false,
        reloading: false,
        hasOtherRunningSession: true,
      }),
    ).toEqual({
      ok: false,
      kind: "error",
      message: RELOAD_OTHER_SESSION_RUNNING_MESSAGE,
    });
  });

  it("allows reload only when all preconditions pass", () => {
    expect(
      evaluateReloadSessionGuard({
        backendId: "codez",
        hasWorkspaceFolder: true,
        sending: false,
        reloading: false,
        hasOtherRunningSession: false,
      }),
    ).toEqual({ ok: true });
  });
});
