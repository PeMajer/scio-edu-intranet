/**
 * Migration: lecturer (single reference) → lecturers (array of references)
 *
 * Run with:
 *   npx sanity exec sanity/migrations/lecturer-to-lecturers.ts --with-user-token
 *
 * Or use the Sanity CLI mutation API directly.
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env manually
const envPath = resolve(process.cwd(), ".env");
try {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
} catch {
  // .env file is optional — skip silently if not present
}

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_TOKEN!,
  useCdn: false,
});

async function migrate() {
  const courses = await client.fetch<
    Array<{ _id: string; lecturer?: { _ref: string } }>
  >(`*[_type == "course" && defined(lecturer)]{ _id, lecturer }`);

  console.log(`Found ${courses.length} courses with a lecturer reference`);

  for (const course of courses) {
    if (!course.lecturer?._ref) continue;

    await client
      .patch(course._id)
      .set({
        lecturers: [{ _type: "reference", _ref: course.lecturer._ref, _key: crypto.randomUUID().slice(0, 8) }],
      })
      .unset(["lecturer"])
      .commit();

    console.log(`Migrated course ${course._id}`);
  }

  console.log("Migration complete");
}

migrate().catch(console.error);
