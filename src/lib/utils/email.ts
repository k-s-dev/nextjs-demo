"use server";

import * as nodemailer from "nodemailer";

import { SendMailError } from "@/lib/utils/errors";
import { getAuthEnvVariables } from "@/lib/features/authentication/verification";
import { getEnvVariableValue } from "./env";

const { authEmailId, authEmailPassword } = await getAuthEnvVariables();
const nodeEnv = await getEnvVariableValue("NODE_ENV");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: authEmailId,
    pass: authEmailPassword,
  },
});

export async function sendMail(dataIn: {
  from: string;
  to: string;
  subject?: string;
  html: string;
  text: string;
  link: string;
}) {
  try {
    if (nodeEnv === "production") {
      await transporter.sendMail(dataIn);
    } else {
      console.log(`send email: ${dataIn.to}, ${dataIn.subject}`);
      console.log(`link: ${dataIn.link}`);
    }
  } catch (error) {
    throw new SendMailError({
      message: "Failed to send email.",
      cause: error,
      log: {
        message: "SendMailError: failed to send email.",
        data: dataIn,
      },
    });
  }
}
