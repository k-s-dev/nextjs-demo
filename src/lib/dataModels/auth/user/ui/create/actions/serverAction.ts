"use server";

import * as v from "valibot";
import { uploadFile } from "@/lib/utils/uploads";
import { parseFormData } from "@/lib/utils/form";
import { TUserFormState, VSUserCrudForm } from "../../../definitions";
import {
  createUser,
  getUserByEmail,
  updateUser,
} from "../../../dataAccessControl";
import { routes } from "@/lib/utils/routeMapper";
import { revalidatePath } from "next/cache";

export async function createUserServerAction(
  imageFile: File | null,
  prevState: TUserFormState | null,
  formData: FormData,
): Promise<TUserFormState> {
  // retreive data
  const parsedFormData = parseFormData({
    formData,
    info: {
      booleans: ["emailVerified"],
    },
    excludeKeys: ["imageFile"],
  });

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

  // check for existing user
  const response = await getUserByEmail(validatedData.email, "server");
  const existingUser =
    response.status === "success" ? response.data : undefined;

  if (existingUser) {
    return {
      status: "error",
      data: parsedFormData,
      errors: {
        root: ["User already exists."],
      },
    };
  }

  // prepare form data for submission to backend
  let user;

  const apiSubmissionData = {
    ...validatedData,
  };

  // try submitting data to backend
  try {
    const response = await createUser(apiSubmissionData);
    if (!response.data) {
      return {
        status: "error",
        data: parsedFormData,
        errors: {
          root: [
            "Failed to create user due to internal server error. Please try again.",
          ],
        },
      };
    }
    user = response.data;
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      data: parsedFormData,
      errors: {
        root: [
          "Failed to create user due to internal server error. Please try again.",
        ],
      },
    };
  }

  // handle image upload
  let imageUploadUrl;
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
            "User created but image upload failed. Please try and update user again.",
          ],
        },
      };
    }
  }

  if (imageUploadUrl) {
    try {
      await updateUser(
        { id: user.id },
        {
          image: imageUploadUrl,
        },
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
  }

  revalidatePath(routes.admin.root);
  return {
    status: "success",
    data: parsedFormData,
  };
}
