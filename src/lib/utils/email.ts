"use server";

import * as nodemailer from "nodemailer";
import { EnvError, SendMailError } from "@/lib/utils/errors";

const nodeEnv = process.env.NODE_ENV;
const emailId = process.env.EMAIL_ID;
const password = process.env.EMAIL_PASSWORD;

if (!nodeEnv || !emailId || !password) {
  throw new EnvError({});
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailId,
    pass: password,
  },
});

export async function sendMail(dataIn: {
  to: string;
  html: string;
  text: string;
  from?: string;
  subject?: string;
}) {
  if (!dataIn.from) {
    dataIn.from = '"Shoonya Dev" <shunya.acad@gmail.com>';
  }

  try {
    if (nodeEnv === "production") {
      await transporter.sendMail(dataIn);
    } else {
      console.log(`send email: ${dataIn.to}, ${dataIn.subject}`);
    }
  } catch (error) {
    throw new SendMailError({
      message: "Failed to send email.",
      cause: error,
      log: {
        data: dataIn,
      },
    });
  }
}
