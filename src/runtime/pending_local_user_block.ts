export function nextPendingLocalUserBlockIdOnSend(args: {
  trimmedText: string;
  userBlockId: string;
}): string | null {
  return args.trimmedText ? args.userBlockId : null;
}

export function resolvePendingLocalUserBlockBinding(args: {
  activeTurnId: string | null;
  pendingLocalUserBlockId: string | null;
}): { blockIdToBind: string | null; nextPendingLocalUserBlockId: string | null } {
  if (!args.activeTurnId || !args.pendingLocalUserBlockId) {
    return {
      blockIdToBind: null,
      nextPendingLocalUserBlockId: args.pendingLocalUserBlockId,
    };
  }

  return {
    blockIdToBind: args.pendingLocalUserBlockId,
    nextPendingLocalUserBlockId: null,
  };
}

export function nextPendingLocalUserBlockIdOnTurnCompleted(): null {
  return null;
}
