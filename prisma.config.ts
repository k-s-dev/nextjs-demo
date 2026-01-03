import path, { dirname } from "node:path";
import { defineConfig } from "prisma/config";
import nextEnv from "@next/env";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const env = nextEnv.loadEnvConfig(__dirname, true);

export default defineConfig({
  schema: path.join(".", "src", "database"),
  datasource: {
    url: env.combinedEnv.DIRECT_URL!,
  },
});
