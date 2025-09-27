import { defineConfig } from "cypress";

import { resetTestDb } from "@/database/utils/test/reset";
import { seedTestDb } from "@/database/utils/test/seed";
import { getUser } from "@/lib/dataModels/auth/user/dataAccess";

export default defineConfig({
  e2e: {
    baseUrl: process.env.HOST,
    defaultCommandTimeout: 10000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        log(message) {
          console.log(message);
          return null;
        },
        "db:reset": resetTestDb,
        "db:seed": seedTestDb,
        logEnv() {
          console.log(process.env.NODE_ENV);
          for (const key in process.env) {
            if (process.env.hasOwnProperty(key)) {
              const element = process.env[key];
              console.log(`${key}: ${element}`);
            }
          }
          return null;
        },
        "db:getUserByEmail": async (email) => {
          return await getUser({ email: email }, "server");
        },
      });
      return config;
    },
  },
});
