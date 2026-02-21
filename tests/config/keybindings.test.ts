import * as fs from "node:fs";
import * as path from "node:path";
import { describe, expect, it } from "vitest";

type PackageJson = {
  contributes?: {
    keybindings?: Array<{
      command?: string;
      key?: string;
      when?: string;
    }>;
  };
};

describe("package.json keybindings", () => {
  it("uses shift+tab for mode switching and avoids ctrl+shift", () => {
    const packageJsonPath = path.resolve(__dirname, "..", "..", "package.json");
    const raw = fs.readFileSync(packageJsonPath, "utf8");
    const pkg = JSON.parse(raw) as PackageJson;
    const keybindings = pkg.contributes?.keybindings ?? [];
    const modeSwitch = keybindings.find(
      (entry) => entry.command === "codez.cycleCollaborationMode",
    );
    expect(modeSwitch).toEqual({
      command: "codez.cycleCollaborationMode",
      key: "shift+tab",
      when: "view == codez.chatView",
    });
    expect(modeSwitch?.key?.toLowerCase()).not.toContain("ctrl+shift");
  });
});
