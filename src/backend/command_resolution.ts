import type { BackendId } from "../sessions";

export type CliCommandConfig = {
  codexCommand: string | undefined;
  codezCommand: string | undefined;
  upstreamCommand: string | undefined;
  mineCommand: string | undefined;
};

export type ResolvedCliCommands = {
  codex: string;
  codez: string;
};

export function resolveCliCommands(cfg: CliCommandConfig): ResolvedCliCommands {
  return {
    codex: cfg.codexCommand ?? cfg.upstreamCommand ?? "codex",
    codez: cfg.codezCommand ?? cfg.mineCommand ?? "codez",
  };
}

export function resolveBackendStartCommand(
  backendId: Exclude<BackendId, "opencode">,
  commands: ResolvedCliCommands,
): string {
  return backendId === "codez" ? commands.codez : commands.codex;
}
