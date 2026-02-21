import { describe, expect, it } from "vitest";

import { buildOpencodeServeArgs } from "../../src/backend/opencode_command";

describe("opencode_command", () => {
  it("defaults to serve + hostname/port when args are not set", () => {
    expect(buildOpencodeServeArgs(undefined)).toEqual([
      "serve",
      "--hostname",
      "127.0.0.1",
      "--port",
      "0",
    ]);
  });

  it("appends hostname/port when missing", () => {
    expect(buildOpencodeServeArgs(["serve", "--foo", "bar"])).toEqual([
      "serve",
      "--foo",
      "bar",
      "--hostname",
      "127.0.0.1",
      "--port",
      "0",
    ]);
  });

  it("does not duplicate hostname/port when long flags already exist", () => {
    expect(
      buildOpencodeServeArgs([
        "serve",
        "--hostname",
        "0.0.0.0",
        "--port",
        "8080",
      ]),
    ).toEqual(["serve", "--hostname", "0.0.0.0", "--port", "8080"]);
  });

  it("does not duplicate hostname/port when equals syntax is used", () => {
    expect(
      buildOpencodeServeArgs(["serve", "--hostname=0.0.0.0", "--port=8080"]),
    ).toEqual(["serve", "--hostname=0.0.0.0", "--port=8080"]);
  });
});
