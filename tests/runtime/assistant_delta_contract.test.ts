import * as fs from "node:fs/promises";
import * as path from "node:path";

import { describe, expect, it } from "vitest";

describe("assistant delta contract", () => {
  it("upserts assistant block on first delta before append-only path", async () => {
    const filePath = path.resolve(__dirname, "../../src/extension.ts");
    const src = await fs.readFile(filePath, "utf8");

    expect(src).toContain("const existed = rt.blockIndexById.has(id);");
    expect(src).toContain("if (!existed) block.text += delta;");
    expect(src).toContain("if (!existed) {");
    expect(src).toContain("chatView?.postBlockUpsert(sessionId, block);");
    expect(src).toContain("rt.pendingAssistantDeltas.set(id, prev ? prev + delta : delta);");
  });

  it("does not anchor by turnId and keeps item order by first-seen append", async () => {
    const filePath = path.resolve(__dirname, "../../src/extension.ts");
    const src = await fs.readFile(filePath, "utf8");

    expect(src).toContain("void turnId;");
    expect(src).toContain("rt.blockIndexById.set(id, rt.blocks.length);");
    expect(src).toContain("rt.blocks.push(block);");
  });
});
