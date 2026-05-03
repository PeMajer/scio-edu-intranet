/**
 * Migration: convert string fields `target_audience` and `highlight` on `course`
 * documents to PortableText arrays.
 *
 * Run with:
 *   npx sanity exec sanity/migrations/text-to-portabletext.ts --with-user-token
 *
 * Set SANITY_DATASET to target a specific dataset (defaults to "production").
 * Always run a backup first:
 *   npx sanity dataset export production backup-$(date +%s).tar.gz
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnv(filePath: string) {
  try {
    const envContent = readFileSync(filePath, "utf-8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = value;
    }
    return true;
  } catch {
    return false;
  }
}

// Try .env in cwd, then parent (so the script works whether run from
// project root or from scioedu/ where the Sanity CLI lives).
if (!loadEnv(resolve(process.cwd(), ".env"))) {
  loadEnv(resolve(process.cwd(), "..", ".env"));
}

// Prefer the user token injected by `sanity exec --with-user-token` (admin/editor),
// fall back to .env tokens (which are typically Viewer / read-only).
const token =
  process.env.SANITY_AUTH_TOKEN ||
  process.env.SANITY_API_TOKEN ||
  process.env.SANITY_TOKEN;

if (!token) {
  console.error("No Sanity write token found. Run with `--with-user-token` (recommended) or set SANITY_API_TOKEN to an Editor/Administrator token.");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

function stringToPortableText(value: string) {
  const paragraphs = value.split(/\n\n+/).filter((p) => p.trim().length > 0);
  if (paragraphs.length === 0) {
    paragraphs.push(value);
  }
  return paragraphs.map((paragraph) => ({
    _type: "block",
    _key: crypto.randomUUID().slice(0, 12),
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: crypto.randomUUID().slice(0, 12),
        text: paragraph.replace(/\n/g, " ").trim(),
        marks: [],
      },
    ],
  }));
}

async function migrate() {
  const courses = await client.fetch<
    Array<{ _id: string; target_audience?: unknown; highlight?: unknown }>
  >(`*[_type == "course" && (defined(target_audience) || defined(highlight))]{ _id, target_audience, highlight }`);

  console.log(`Found ${courses.length} courses to inspect.`);

  let migrated = 0;
  for (const course of courses) {
    const patch: Record<string, unknown> = {};

    if (typeof course.target_audience === "string" && course.target_audience.trim().length > 0) {
      patch.target_audience = stringToPortableText(course.target_audience);
    }
    if (typeof course.highlight === "string" && course.highlight.trim().length > 0) {
      patch.highlight = stringToPortableText(course.highlight);
    }

    if (Object.keys(patch).length === 0) continue;

    await client.patch(course._id).set(patch).commit();
    migrated += 1;
    console.log(`Migrated ${course._id} (${Object.keys(patch).join(", ")})`);
  }

  console.log(`\nMigration complete. ${migrated} document(s) updated.`);
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
