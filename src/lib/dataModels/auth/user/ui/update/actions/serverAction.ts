"use server";

import * as v from "valibot";
import { deleteUploadedFile, uploadFile } from "@/lib/utils/uploads";
import { parseFormData } from "@/lib/utils/form";
import {
  TUserFormState,
  TUserPublic,
  userRoleEnum,
  VSUserCrudForm,
} from "../../../definitions";
import { updateUser } from "../../../dataAccessControl";
import { revalidatePath } from "next/cache";
import { routes } from "@/lib/utils/routeMapper";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/features/authentication/getSessionUser";

export async function updateUserServerAction(
  user: TUserPublic,
  imageFile: File | null,
  prevState: TUserFormState | null,
  formData: FormData,
): Promise<TUserFormState> {
  const sessionUser = await getSessionUser();

  // retreive data
  let parsedFormData = parseFormData({
    formData,
    info: {
      booleans: ["emailVerified"],
    },
    excludeKeys: ["imageFile"],
  });

  // security: ensure on backend that SUPERUSER role cannot be changed
  if (user.role === userRoleEnum.SUPERUSER) {
    parsedFormData = {
      ...parsedFormData,
      role: userRoleEnum.SUPERUSER,
    };
  }

  // Validate form
  const validationResult = v.safeParse(VSUserCrudForm, parsedFormData);

  // handle validation errors
  if (!validationResult.success) {
    const errors = v.flatten<typeof VSUserCrudForm>(validationResult.issues);
    return {
      ...prevState,
      status: "error",
      data: parsedFormData,
      errors: errors,
    };
  }

  const validatedData = validationResult.output;

  // prepare form data for submission to backend
  const apiSubmissionData = {
    ...validatedData,
  };

  // try submitting data to backend
  try {
    await updateUser({ id: user.id }, apiSubmissionData, "client", sessionUser);
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      data: parsedFormData,
      errors: {
        root: [
          "Failed to update user due to internal server error. Please try again.",
        ],
      },
    };
  }

  // handle image upload
  let imageUploadUrl = null;

  if (!imageFile && user.image) {
    try {
      await deleteUploadedFile({ uploadUrl: user.image });
    } catch {
      return {
        status: "error",
        data: parsedFormData,
        errors: {
          root: [
            "Failed to clear user image. Please try and update user again.",
          ],
        },
      };
    }
  }

  if (imageFile && imageFile.size > 0) {
    try {
      imageUploadUrl = await uploadFile({
        uploadFile: imageFile,
        uploadDir: `uploads/user/${user.id}/images/`,
        fileNameWoExt: "profile-pic",
      });
    } catch (error) {
      console.log(error);
      return {
        status: "error",
        data: parsedFormData,
        errors: {
          root: [
            "User updated but image upload failed. Please try and update user again.",
          ],
        },
      };
    }
  }

  try {
    await updateUser(
      { id: user.id },
      {
        image: imageUploadUrl,
      },
      "client",
      sessionUser,
    );
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      data: parsedFormData,
      errors: {
        root: [
          "User created but image upload failed. Please try and update user again.",
        ],
      },
    };
  }

  revalidatePath(routes.admin.root);
  redirect(routes.admin.user.withId(user.id, "detail"));
}
