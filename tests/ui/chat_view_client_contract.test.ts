import * as fs from "node:fs/promises";
import * as path from "node:path";

import { describe, expect, it } from "vitest";

describe("chat_view_client contract", () => {
  it("keeps rewind target for opencode sessions", async () => {
    const filePath = path.resolve(__dirname, "../../src/ui/chat_view_client.ts");
    const src = await fs.readFile(filePath, "utf8");

    expect(src).toContain(
      "if (backendId !== \"codez\" && backendId !== \"opencode\" && rewindTarget !== null) setEditMode(null);",
    );
  });

  it("shows dedicated steer/queue runtime actions while sending", async () => {
    const filePath = path.resolve(__dirname, "../../src/ui/chat_view_client.ts");
    const src = await fs.readFile(filePath, "utf8");

    expect(src).toContain(
      "runtimeActionRowEl.style.display = s.sending ? \"flex\" : \"none\";",
    );
    expect(src).toContain("steerSendBtn.addEventListener(\"click\"");
    expect(src).toContain("queueSendBtn.addEventListener(\"click\"");
    expect(src).toContain("mode: \"send\" | \"queue\" | \"steer\"");
  });

  it("inserts blockUpsert before anchor block when insertBeforeBlockId is provided", async () => {
    const filePath = path.resolve(__dirname, "../../src/ui/chat_view_client.ts");
    const src = await fs.readFile(filePath, "utf8");

    expect(src).toContain("const insertBeforeBlockId =");
    expect(src).toContain("insertBeforeBlockId !== block.id");
    expect(src).toContain("blocks.splice(beforeIdx, 0, block);");
  });

  it("keeps command/fileChange/mcp/collab blocks in top-level render order", async () => {
    const filePath = path.resolve(__dirname, "../../src/ui/chat_view_client.ts");
    const src = await fs.readFile(filePath, "utf8");

    expect(src).toContain("if (block.type === \"command\")");
    expect(src).toContain("if (block.type === \"fileChange\")");
    expect(src).toContain("if (block.type === \"mcp\")");
    expect(src).toContain("if (block.type === \"collab\")");
    expect(src).toContain("placeTopLevel(det);");
  });
});
