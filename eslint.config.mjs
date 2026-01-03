import { defineConfig, globalIgnores } from "@eslint/config-helpers";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import safeql from "@ts-safeql/eslint-plugin/config";
import pkg from "@next/env";
const { loadEnvConfig } = pkg;
const projectDir = process.cwd();
loadEnvConfig(projectDir);

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "envConfig.ts",
  ]),
  safeql.configs.connections({
    databaseUrl: process.env.DATABASE_URL,
    targets: [{ tag: "sql" }],
  }),
]);

export default eslintConfig;
