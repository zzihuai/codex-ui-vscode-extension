import { describe, expect, it } from "vitest";

import {
  canReopenSessionInBackend,
  isCodexFamilyBackend,
  isSessionBackendId,
  sessionCompatibilityMessage,
} from "../src/session_backend";

describe("session_backend", () => {
  it("recognizes supported backend ids", () => {
    expect(isSessionBackendId("codex")).toBe(true);
    expect(isSessionBackendId("codez")).toBe(true);
    expect(isSessionBackendId("opencode")).toBe(true);
    expect(isSessionBackendId("unknown")).toBe(false);
  });

  it("recognizes codex family backends", () => {
    expect(isCodexFamilyBackend("codex")).toBe(true);
    expect(isCodexFamilyBackend("codez")).toBe(true);
    expect(isCodexFamilyBackend("opencode")).toBe(false);
  });

  it("allows reopen only inside codex/codez family", () => {
    expect(canReopenSessionInBackend("codex", "codez")).toBe(true);
    expect(canReopenSessionInBackend("codez", "codex")).toBe(true);
    expect(canReopenSessionInBackend("codex", "codex")).toBe(true);
    expect(canReopenSessionInBackend("opencode", "codex")).toBe(false);
    expect(canReopenSessionInBackend("codez", "opencode")).toBe(false);
  });

  it("returns compatibility message for each backend", () => {
    expect(sessionCompatibilityMessage("opencode")).toContain(
      "not compatible",
    );
    expect(sessionCompatibilityMessage("codex")).toContain(
      "share a compatible history format",
    );
    expect(sessionCompatibilityMessage("codez")).toContain(
      "share a compatible history format",
    );
  });
});
