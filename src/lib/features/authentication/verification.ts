"use server";

import * as jose from "jose";

import { TOKEN_TYPE } from "@/generated/prisma";
import { getEnvVariableValue } from "@/lib/utils/env";
import {
  createVerificationToken,
  deleteExpiredVerificationTokens,
  deleteVerificationToken,
  getVerificationToken,
} from "@/lib/dataModels/auth/verificationToken";
import { getUser, updateUser } from "@/lib/dataModels/auth/user/dataAccess";
import { sendMail } from "@/lib/utils/email";
import { DbError } from "@/lib/utils/errors";
import { routes } from "@/lib/utils/routeMapper";
import { getHostUrl } from "@/lib/actions/getHostUrl";

const { authSecret } = await getAuthEnvVariables();
const jwtSecret = jose.base64url.decode(authSecret);

export async function getAuthEnvVariables() {
  const authSecret = await getEnvVariableValue("AUTH_SECRET");
  const authEmailId = await getEnvVariableValue("AUTH_EMAIL_ID");
  const authEmailPassword = await getEnvVariableValue("AUTH_EMAIL_PASSWORD");

  return { authSecret, authEmailId, authEmailPassword };
}

export async function generateVerificationToken(
  email: string,
  tokenType: TOKEN_TYPE,
) {
  const tokenObj = await getVerificationToken(email, tokenType);
  if (tokenObj) {
    await deleteVerificationToken(tokenObj.email, tokenObj.token, tokenType);
    await deleteExpiredVerificationTokens();
  }

  const expires = new Date(new Date().getTime() + 2 * 3600 * 1000);
  const payloadIn = { email };

  const jwt = await new jose.EncryptJWT(payloadIn)
    .setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
    .setExpirationTime(expires)
    .encrypt(jwtSecret);

  await createVerificationToken({
    email: email,
    token: jwt,
    expires: expires,
    type: tokenType,
  });

  return jwt;
}

export async function sendVerificationEmail(
  email: string,
  tokenType: TOKEN_TYPE,
) {
  await deleteExpiredVerificationTokens();

  const host = await getHostUrl();

  let title;
  let url;
  const token = await generateVerificationToken(email, tokenType);

  switch (tokenType.valueOf()) {
    case TOKEN_TYPE.EMAIL_VERFICATION:
      title = "Email verification";
      url = `${host}${routes.authentication.verifyEmail}/?verificationToken=${token}`;
      break;

    case TOKEN_TYPE.RESET_PASSWORD:
      title = "Reset password";
      url = `${host}${routes.authentication.resetPassword}/?verificationToken=${token}`;
      break;

    default:
      return;
  }

  await sendMail({
    from: '"Shoonya Dev" <shunya.acad@gmail.com>',
    to: email,
    subject: `Simple auth: ${title} link`,
    html: html(url, title),
    text: text(url, title),
    link: url,
  });
}

export async function verifyToken(
  token: string,
  tokenType: TOKEN_TYPE,
): Promise<{
  data?: jose.JWTDecryptResult<jose.JWTPayload> | undefined;
  status?: "success" | "failed" | "verified";
  message?: string;
  log?: string;
}> {
  let result;

  try {
    result = await jose.jwtDecrypt(token, jwtSecret, {});
  } catch {
    return {
      status: "failed",
      data: result,
      message: "Invalid token.",
    };
  }

  if (tokenType.valueOf() === TOKEN_TYPE.EMAIL_VERFICATION) {
    const user = await getUser(
      {
        email: result.payload.email as string,
      },
      "server",
    );

    if (!user) {
      return {
        status: "failed",
        message: "Invalid token.",
      };
    }

    if (user.emailVerified) {
      return {
        status: "verified",
        data: result,
      };
    }
  }

  try {
    await updateUser(
      { email: result.payload.email as string },
      {
        emailVerified: new Date(),
      },
      "server",
    );
  } catch (error) {
    throw new DbError({
      message: "Email verification failed due to internal server error.",
      cause: error,
      log: {
        message: "DbError: User update failed.",
        data: result.payload,
      },
    });
  }

  await deleteVerificationToken(
    result.payload.email as string,
    token,
    tokenType,
  );

  await deleteExpiredVerificationTokens();

  return {
    status: "success",
    data: result,
  };
}

function html(url: string, title: string) {
  const brandColor = "#346df1";
  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: "#fff",
  };

  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        <strong>${title} link for Simple auth</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;"
              bgcolor="${color.buttonBackground}"
              >
                <a href="${url}"
                  target="_blank"
                  style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;"
                  >${title}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`;
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text(url: string, title: string) {
  return `${title} for Simple auth\n${url}\n\n`;
}
