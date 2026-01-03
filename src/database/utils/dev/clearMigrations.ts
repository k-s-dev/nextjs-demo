// clear dev.db, generated prisma client

import { rm, stat } from "node:fs/promises";
import { glob } from "glob";
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
  for (const entry of await glob.glob(`${paths.migrations}/**/*`)) {
    const stats = await stat(entry);
    if (stats.isDirectory() && !entry.includes("0_init")) {
      await rm(paths.migrations, { recursive: true, force: true });
    }
  }
}

clearPaths();
