export type SessionBackendId = "codex" | "codez" | "opencode";

export function isSessionBackendId(value: string): value is SessionBackendId {
  return value === "codex" || value === "codez" || value === "opencode";
}

export function isCodexFamilyBackend(
  value: string,
): value is "codex" | "codez" {
  return value === "codex" || value === "codez";
}

export function canReopenSessionInBackend(
  from: SessionBackendId,
  to: SessionBackendId,
): boolean {
  if (from === to) {
    return true;
  }
  return isCodexFamilyBackend(from) && isCodexFamilyBackend(to);
}

export function sessionCompatibilityMessage(backend: SessionBackendId): string {
  if (backend === "opencode") {
    return "opencode history is not compatible with codex/codez, so this session cannot be carried over to codex/codez.";
  }
  return "codex and codez share a compatible history format, so you can reopen this thread in either codex or codez (but not in opencode).";
}
