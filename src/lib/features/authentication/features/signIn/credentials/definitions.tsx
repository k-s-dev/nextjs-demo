import { VSUserBase } from "@/lib/dataModels/auth/user/definitions";
import * as v from "valibot";

export const VSSignInFormBase = v.required(
  v.pick(VSUserBase, ["email"]),
  "Required",
);

export const VSSignInForm = v.required(
  v.pick(VSUserBase, ["email", "password"]),
  "Required.",
);
