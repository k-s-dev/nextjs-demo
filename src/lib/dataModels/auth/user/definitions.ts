import prisma from "@/database/prismaClient";
import { Prisma, USER_ROLE } from "@/generated/prisma";
import * as v from "valibot";

// generic User form related schemas and types
// may include extra fields, e.g. "confirmPassword"
export const VSUserBase = v.partial(
  v.object({
    id: v.string(),
    email: v.pipe(
      v.string("Your email must be a string."),
      v.nonEmpty("Required."),
      v.email("The email address is badly formatted."),
    ),
    name: v.string("Name must be a string."),
    emailVerified: v.pipe(
      v.string(),
      v.transform((input) => {
        if (!input || input === "") return undefined;
        return new Date(input);
      }),
    ),
    role: v.enum(USER_ROLE),
    image: v.string(),
    profile: v.string(),
    groups: v.array(v.string()),
    permissions: v.array(v.string()),
    password: v.pipe(
      v.string("Password must be a string."),
      v.nonEmpty("Required."),
      v.minLength(8, "Your password must have 8 characters or more."),
    ),
    confirmPassword: v.pipe(v.string(), v.nonEmpty("Required.")),
  }),
);

export const VSUser = v.required(v.omit(VSUserBase, ["confirmPassword"]), [
  "id",
  "email",
  "role",
]);

export const VSUserPublic = v.required(
  v.pick(VSUser, ["id", "email", "name", "role", "image", "emailVerified"]),
  ["id", "email", "role"],
);

// full object for use in server
export type TUser = v.InferInput<typeof VSUser>;

// partial object for use in ui
export type TUserPublic = v.InferInput<typeof VSUserPublic>;

export type TUserPrisma = Prisma.Result<
  typeof prisma.user,
  Prisma.UserFindUniqueArgs,
  "findUnique"
>;
export type TUserListPrisma = Prisma.Result<
  typeof prisma.user,
  Prisma.UserFindManyArgs,
  "findMany"
>;

export const VSUserFormStateData = v.omit(VSUserBase, ["id"]);
// export type TUserForm = v.InferInput<typeof VSUserFormStateData>;
export type TUserFormStateData = v.InferInput<typeof VSUserFormStateData>;
export type TUserFormStateErrors = v.FlatErrors<typeof VSUserBase>;
export type TUserFormState = {
  mode: "create" | "read" | "update";
  status?: "success" | "failed";
  data?: TUserFormStateData;
  errors?: TUserFormStateErrors;
  messages?: string[];
};

// admin: User crud forms
export const VSUserCrudForm = v.omit(v.required(VSUser, ["email"]), [
  "password",
  "id",
]);

export type TUserCrudForm = v.InferInput<typeof VSUserCrudForm>;
