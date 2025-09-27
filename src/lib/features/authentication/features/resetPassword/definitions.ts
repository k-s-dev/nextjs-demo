import { VSUserBase } from "@/lib/dataModels/auth/user/definitions";
import * as v from "valibot";

export const VSResetPasswordForm = v.pipe(
  v.required(
    v.pick(VSUserBase, [
      "email",
      "password",
      "confirmPassword",
    ]),
    ["email", "password", "confirmPassword"],
    "Required.",
  ),
  v.forward(
    v.partialCheck(
      [["password"], ["confirmPassword"]],
      (input) => input.password === input.confirmPassword,
      "The two passwords do not match.",
    ),
    ["confirmPassword"],
  ),
);

