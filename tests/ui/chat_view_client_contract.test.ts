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
});
