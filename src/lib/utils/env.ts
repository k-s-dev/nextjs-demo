import { EnvError } from "./errors";

export async function getEnvVariableValue(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new EnvError({
      message: "Internal server error.",
      log: {
        message: `EnvError: unable to retreive variable: ${name}`,
      },
    });
  }

  return value;
}
