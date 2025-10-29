import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import { globalIgnores } from "@eslint/config-helpers";
import nextEnv from "@next/env";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const env = nextEnv.loadEnvConfig(__dirname, true);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  globalIgnores(["src/generated/**/*"]),
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript"],
    plugins: ["@ts-safeql/eslint-plugin"],
    parserOptions: {
      project: "./tsconfig.json",
    },
    rules: {
      "@ts-safeql/check-sql": [
        "error",
        {
          connections: [
            {
              connectionUrl: env.combinedEnv.DATABASE_URL,
              migrationsDir: "./src/database/migrations",
              targets: [
                {
                  tag: "prisma.+($queryRaw|$executeRaw)",
                  transform: "{type}[]",
                },
              ],
            },
          ],
        },
      ],
    },
  }),
];

export default eslintConfig;
