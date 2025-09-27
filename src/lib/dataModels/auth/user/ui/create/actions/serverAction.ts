"use server";

import * as v from "valibot";

import { saveFileUpload } from "@/lib/utils/uploads";
import { parseFormData } from "@/lib/utils/form";
import { TUser, TUserFormState, VSUserCrudForm } from "../../../definitions";
import { createUser, getUserByEmail, updateUser } from "../../../dataAccess";
import { routes } from "@/lib/utils/routeMapper";
import { revalidatePath } from "next/cache";

export async function createUserServerAction(
  imageFile: File | null,
  prevState: TUserFormState | null,
  formData: FormData,
): Promise<TUserFormState> {
  // retreive data
  const rawFormData = parseFormData(formData);

  // Validate form
  const validationResult = v.safeParse(VSUserCrudForm, rawFormData);

  // handle validation errors
  if (!validationResult.success) {
    const errors = v.flatten<typeof VSUserCrudForm>(validationResult.issues);
    return {
      ...prevState,
      mode: "create",
      status: "failed",
      data: rawFormData,
      errors: errors,
    };
  }

  const validatedData = validationResult.output;

  // check for existing user
  const existingUser: TUser = await getUserByEmail(
    validatedData.email,
    "server",
  );

  if (existingUser) {
    return {
      mode: "create",
      status: "failed",
      data: rawFormData,
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
    user = await createUser(apiSubmissionData);
  } catch (error) {
    console.log(error);
    return {
      mode: "create",
      status: "failed",
      data: rawFormData,
      errors: {
        root: [
          "Failed to create user due to internal server error. Please try again.",
        ],
      },
    };
  }

  // handle image upload
  let imageUploadBlob;
  if (imageFile && imageFile.size > 0) {
    try {
      imageUploadBlob = await saveFileUpload({
        uploadFile: imageFile,
        uploadDir: `uploads/user/${user.id}/images/`,
        fileNameWoExt: "profile-pic",
      });
    } catch (error) {
      console.log(error);
      return {
        mode: "create",
        status: "failed",
        data: rawFormData,
        errors: {
          root: [
            "User created but image upload failed. Please try and update user again.",
          ],
        },
      };
    }
  }

  if (imageUploadBlob) {
    try {
      await updateUser(
        { id: user.id },
        {
          image: imageUploadBlob.url,
        },
      );
    } catch (error) {
      console.log(error);
      return {
        mode: "create",
        status: "failed",
        data: rawFormData,
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
    mode: "create",
    status: "success",
    data: rawFormData,
  }
}
