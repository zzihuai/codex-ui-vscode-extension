import { describe, expect, it } from "vitest";

import {
  resolveBackendStartCommand,
  resolveCliCommands,
} from "../../src/backend/command_resolution";

describe("command_resolution", () => {
  it("prefers explicit codex/codez command keys", () => {
    const commands = resolveCliCommands({
      codexCommand: "codex-stable",
      codezCommand: "codez-local",
      upstreamCommand: "legacy-upstream",
      mineCommand: "legacy-mine",
    });
    expect(commands).toEqual({
      codex: "codex-stable",
      codez: "codez-local",
    });
  });

  it("falls back to legacy keys when new keys are not set", () => {
    const commands = resolveCliCommands({
      codexCommand: undefined,
      codezCommand: undefined,
      upstreamCommand: "codex-legacy",
      mineCommand: "codez-legacy",
    });
    expect(commands).toEqual({
      codex: "codex-legacy",
      codez: "codez-legacy",
    });
  });

  it("falls back to built-in defaults when no config exists", () => {
    const commands = resolveCliCommands({
      codexCommand: undefined,
      codezCommand: undefined,
      upstreamCommand: undefined,
      mineCommand: undefined,
    });
    expect(commands).toEqual({
      codex: "codex",
      codez: "codez",
    });
  });

  it("selects backend-specific command for codex/codez", () => {
    const commands = { codex: "codex-stable", codez: "codez-local" };
    expect(resolveBackendStartCommand("codex", commands)).toBe("codex-stable");
    expect(resolveBackendStartCommand("codez", commands)).toBe("codez-local");
  });
});
