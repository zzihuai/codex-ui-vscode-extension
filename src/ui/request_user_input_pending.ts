export type PendingRequestUserInputResolver = (resp: {
  cancelled: boolean;
  answersById: Record<string, string[]>;
}) => void;

export function drainPendingRequestUserInput(
  pending: Map<string, PendingRequestUserInputResolver>,
): void {
  for (const resolver of pending.values()) {
    resolver({ cancelled: true, answersById: {} });
  }
  pending.clear();
}
