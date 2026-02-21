export function buildOpencodeServeArgs(rawArgs: string[] | undefined): string[] {
  const args = [...(rawArgs ?? ["serve"])];
  const hasHostname = args.some(
    (arg) => arg === "--hostname" || arg.startsWith("--hostname="),
  );
  const hasPort = args.some((arg) => arg === "--port" || arg.startsWith("--port="));

  if (!hasHostname) args.push("--hostname", "127.0.0.1");
  if (!hasPort) args.push("--port", "0");
  return args;
}
