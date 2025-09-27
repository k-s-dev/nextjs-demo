import "@testing-library/jest-dom";
import "@testing-library/jest-dom/jest-globals";
import { execSync, ExecSyncOptions } from "child_process";

// https://stackoverflow.com/questions/68468203/why-am-i-getting-textencoder-is-not-defined-in-jest
import { TextEncoder, TextDecoder } from "util";
Object.assign(global, { TextDecoder, TextEncoder });

const execSyncOptions: ExecSyncOptions = {
  stdio: "inherit",
};

beforeEach(() => {
  execSync("npm run test:prisma:reset", execSyncOptions);
  execSync("npm run test:prisma:push", execSyncOptions);
});

