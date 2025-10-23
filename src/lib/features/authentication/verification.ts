"use server";

import { deleteExpiredVerificationTokens } from "@/lib/dataModels/auth/verification/dataAccessControl";
import { sendMail } from "@/lib/utils/email";
import { createEmailHtml } from "./createEmailHtml";
import { TOKEN_TYPE } from "./definitions";
import { getEnvVariableValue } from "@/lib/utils/env";

export async function sendVerificationEmail(
  email: string,
  url: string,
  tokenType: TOKEN_TYPE,
) {
  const appName = (await getEnvVariableValue("APP_NAME")).toUpperCase();
  const nodeEnv = await getEnvVariableValue("NODE_ENV");

  await deleteExpiredVerificationTokens();

  let title, text;

  switch (tokenType) {
    case "EMAIL_VERIFICATION":
      title = "Email verification";
      text = "verify your email";
      break;

    case "RESET_PASSWORD":
      title = "Reset password";
      text = "reset your password";
      break;

    default:
      return;
  }

  if (nodeEnv === "production") {
    await sendMail({
      to: email,
      subject: `${appName}: ${title} link`,
      html: await createEmailHtml(url, title),
      text: `Click the link to ${text}: ${url}`,
    });
  } else if (nodeEnv === "development") {
    console.log(`${tokenType} verification url:\n${url}`);
  }
}
