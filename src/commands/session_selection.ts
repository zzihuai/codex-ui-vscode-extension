export type SessionSelectionDecision = "alreadyLoaded" | "loadHistory";

export function decideSessionSelection(
  hasConversationBlocks: boolean,
): SessionSelectionDecision {
  return hasConversationBlocks ? "alreadyLoaded" : "loadHistory";
}

export type LoadHistoryPostHydrationAction = "refresh" | "activate";

export function decideLoadHistoryPostHydrationAction(args: {
  activeSessionId: string | null;
  targetSessionId: string;
}): LoadHistoryPostHydrationAction {
  return args.activeSessionId === args.targetSessionId ? "refresh" : "activate";
}

export function shouldForceLoadHistoryForRewind(args: {
  backendId: "codex" | "codez" | "opencode";
  hasUserBlockWithoutTurnId: boolean;
}): boolean {
  if (!args.hasUserBlockWithoutTurnId) return false;
  return args.backendId === "codez" || args.backendId === "opencode";
}
