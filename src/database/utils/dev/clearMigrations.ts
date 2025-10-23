// clear dev.db, generated prisma client

import { rm } from "node:fs/promises";
import path from "node:path";

const paths = {
  root: process.cwd(),
  get src() {
    return path.join(this.root, "src", "database");
  },
  get migrations() {
    return path.join(this.src, "migrations");
  },
};

async function clearPaths() {
  await rm(paths.migrations, { recursive: true, force: true });
}

clearPaths();

