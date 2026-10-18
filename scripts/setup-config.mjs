#!/usr/bin/env node
/**
 * Create forgejo/app.ini from the committed template, filling every
 * {{GENERATE}} marker with a fresh secret.
 *
 * The live file is gitignored, and an existing file is never touched, so this
 * is safe to run on a checkout that already has an instance.
 *
 * Secrets are produced by Forgejo's own generator inside the same image
 * compose.yml uses (INTERNAL_TOKEN must be a signed JWT, not arbitrary text).
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const IMAGE = process.env.FORGEJO_IMAGE ?? "codeberg.org/forgejo/forgejo:17";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = join(root, "forgejo/app.ini");
const template = join(root, "forgejo/app.ini.example");

if (existsSync(target)) {
  console.log("forgejo/app.ini exists — leaving it untouched.");
  process.exit(0);
}

const runtime = ["podman", "docker"].find((bin) => {
  try {
    execFileSync(bin, ["--version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
});

if (!runtime) {
  console.error(
    "No podman or docker found. Generating app.ini needs a container runtime\n" +
      "for `forgejo generate secret`. Install one, or copy forgejo/app.ini.example\n" +
      "to forgejo/app.ini and fill each {{GENERATE}} marker manually with:\n\n" +
      `  ${IMAGE} → forgejo generate secret INTERNAL_TOKEN | JWT_SECRET | LFS_JWT_SECRET\n`,
  );
  process.exit(1);
}

const secret = (kind) =>
  execFileSync(
    runtime,
    [
      "run",
      "--rm",
      "--entrypoint",
      "forgejo",
      IMAGE,
      "generate",
      "secret",
      kind,
    ],
    { encoding: "utf8" },
  ).trim();

const kinds = ["INTERNAL_TOKEN", "JWT_SECRET", "LFS_JWT_SECRET"];
const secrets = Object.fromEntries(kinds.map((kind) => [kind, secret(kind)]));

let config = readFileSync(template, "utf8");
for (const kind of kinds) {
  const marker = `{{GENERATE:${kind}}}`;
  if (!config.includes(marker)) {
    throw new Error(`template is missing ${marker}`);
  }
  config = config.replaceAll(marker, secrets[kind]);
}

writeFileSync(target, config);
console.log("Wrote forgejo/app.ini with fresh instance secrets.");
