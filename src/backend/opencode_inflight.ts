export function withInFlightReset<T>(
  start: Promise<T>,
  onSettled: () => void,
): Promise<T> {
  return start.finally(onSettled);
}
