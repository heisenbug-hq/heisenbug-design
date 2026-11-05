#!/usr/bin/env node
import { sync } from "./documents.mjs";
await sync();
console.log("Synced DESIGN.md and docs/ui-standards.md");
