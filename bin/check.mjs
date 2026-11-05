#!/usr/bin/env node
import { check } from "./documents.mjs";
const differences = await check();
if (differences.length) {
  console.error(
    `Design copies differ: ${differences.join(", ")}. Run design:sync.`,
  );
  process.exitCode = 1;
} else console.log("Design copies are current");
