import { describe, expect, it } from "vitest";

import {
  makeBackendInstanceKey,
  parseBackendInstanceKey,
} from "../../src/backend/backend_instance_key";

describe("backend_instance_key", () => {
  it("round-trips workspace uri and backend id", () => {
    const key = makeBackendInstanceKey("file:///repo", "codez");
    expect(parseBackendInstanceKey(key)).toEqual({
      workspaceFolderUri: "file:///repo",
      backendId: "codez",
    });
  });

  it("accepts all supported backend ids", () => {
    expect(
      parseBackendInstanceKey(makeBackendInstanceKey("file:///r1", "codex"))
        .backendId,
    ).toBe("codex");
    expect(
      parseBackendInstanceKey(makeBackendInstanceKey("file:///r2", "codez"))
        .backendId,
    ).toBe("codez");
    expect(
      parseBackendInstanceKey(makeBackendInstanceKey("file:///r3", "opencode"))
        .backendId,
    ).toBe("opencode");
  });

  it("rejects malformed key and unsupported backend", () => {
    expect(() => parseBackendInstanceKey("not-json")).toThrow(
      "Invalid backend instance key",
    );
    expect(() => parseBackendInstanceKey(JSON.stringify(["file:///repo"])))
      .toThrow("expected [workspaceFolderUri, backendId]");
    expect(() =>
      parseBackendInstanceKey(JSON.stringify(["file:///repo", "other"])),
    ).toThrow("backendId must be codex|codez|opencode");
  });
});
