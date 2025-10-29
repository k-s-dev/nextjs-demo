// clear dev.db, generated prisma client

import { rm } from "node:fs/promises";
import path from "node:path";

const paths = {
  root: process.cwd(),
  get src() {
    return path.join(this.root, "src");
  },
  get generated() {
    return path.join(this.src, "generated");
  },
};

async function clearPaths() {
  await rm(paths.generated, { recursive: true, force: true });
}

clearPaths();

