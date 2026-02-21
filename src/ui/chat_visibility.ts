import type { ChatViewState } from "./chat_view";

export function shouldAutoReloadOnChatTabVisible(state: ChatViewState): boolean {
  const active = state.activeSession;
  if (!active) return false;
  if (active.backendId !== "codez") return false;
  if (state.sending || state.reloading) return false;
  if ((state.blocks?.length ?? 0) > 0) return false;
  return true;
}
