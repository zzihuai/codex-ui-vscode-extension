import type { BackendId } from "../sessions";
import { canReopenSessionInBackend, isSessionBackendId } from "../session_backend";

export const REOPEN_INCOMPATIBLE_MESSAGE =
  "This thread is not compatible with opencode history, so it cannot be reopened across codex/codez <-> opencode.";
export const RELOAD_UNSUPPORTED_MESSAGE =
  "Reload is supported for codez sessions only.";
export const RELOAD_SENDING_MESSAGE =
  "Cannot reload while a turn is in progress.";
export const RELOAD_OTHER_SESSION_RUNNING_MESSAGE =
  "Cannot reload while another session is running.";
export const RELOAD_WORKSPACE_MISSING_MESSAGE =
  "WorkspaceFolder not found for session.";

export function parseReopenCommandArgs(
  args: unknown,
): { sessionId: string; backendId: BackendId } | null {
  if (typeof args !== "object" || args === null) return null;
  const anyArgs = args as Record<string, unknown>;
  const sessionId = anyArgs["sessionId"];
  const backendId = anyArgs["backendId"];
  if (typeof sessionId !== "string" || !sessionId) return null;
  if (typeof backendId !== "string" || !isSessionBackendId(backendId))
    return null;
  return { sessionId, backendId };
}

export function canReopenToBackend(
  sourceBackendId: BackendId,
  targetBackendId: BackendId,
): { ok: true } | { ok: false; message: string } {
  if (!canReopenSessionInBackend(sourceBackendId, targetBackendId)) {
    return { ok: false, message: REOPEN_INCOMPATIBLE_MESSAGE };
  }
  return { ok: true };
}

export function evaluateReopenSessionAction(args: {
  sourceBackendId: BackendId;
  targetBackendId: BackendId;
  existingSessionId: string | null;
}):
  | { ok: false; message: string }
  | { ok: true; action: "reuseExisting" | "createNew" } {
  const compatibility = canReopenToBackend(
    args.sourceBackendId,
    args.targetBackendId,
  );
  if (!compatibility.ok) return compatibility;
  if (args.existingSessionId) {
    return { ok: true, action: "reuseExisting" };
  }
  return { ok: true, action: "createNew" };
}

export function evaluateReloadSessionGuard(args: {
  backendId: BackendId;
  hasWorkspaceFolder: boolean;
  sending: boolean;
  reloading: boolean;
  hasOtherRunningSession: boolean;
}):
  | { ok: true }
  | { ok: false; kind: "info" | "error" | "silent"; message: string | null } {
  if (args.backendId !== "codez") {
    return { ok: false, kind: "info", message: RELOAD_UNSUPPORTED_MESSAGE };
  }
  if (!args.hasWorkspaceFolder) {
    return { ok: false, kind: "error", message: RELOAD_WORKSPACE_MISSING_MESSAGE };
  }
  if (args.sending) {
    return { ok: false, kind: "error", message: RELOAD_SENDING_MESSAGE };
  }
  if (args.hasOtherRunningSession) {
    return {
      ok: false,
      kind: "error",
      message: RELOAD_OTHER_SESSION_RUNNING_MESSAGE,
    };
  }
  if (args.reloading) {
    return { ok: false, kind: "silent", message: null };
  }
  return { ok: true };
}
