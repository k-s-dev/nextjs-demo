"use server";

import path from "node:path";
import { access, mkdir, unlink, writeFile } from "node:fs/promises";
import { put, del } from "@vercel/blob";
import { ApiError } from "./errors";
import { getEnvVariableValue } from "./env";

export async function uploadFile({
  uploadFile,
  uploadDir,
  fileNameWoExt,
  fileExt,
}: {
  uploadFile: File;
  uploadDir: string;
  fileNameWoExt?: string;
  fileExt?: string;
}) {
  let uploadUrl;

  // values: vercel-blob, local (fallback)
  const uploadMethod = await getEnvVariableValue("UPLOAD_METHOD");
  const fnProps = {
    uploadFile,
    uploadDir,
    fileNameWoExt,
    fileExt,
  };

  if (uploadMethod === "vercel-blob") {
    uploadUrl = await uploadFileVercelBlob(fnProps);
  } else {
    uploadUrl = await uploadFileLocal(fnProps);
  }

  return uploadUrl;
}

export async function uploadFileVercelBlob({
  uploadFile,
  uploadDir,
  fileNameWoExt,
  fileExt,
}: {
  uploadFile: File;
  uploadDir: string;
  fileNameWoExt?: string;
  fileExt?: string;
}) {
  let blob;

  const env = await getEnvVariableValue("NODE_ENV");
  const app_name = await getEnvVariableValue("APP_NAME");

  fileExt = fileExt ? fileExt : uploadFile.name.split(".")[1].toLowerCase();
  const fileName = fileNameWoExt
    ? `${fileNameWoExt}.${fileExt}`
    : uploadFile.name;

  const uploadFilePath = path
    .join(`${app_name}/${env}/${uploadDir}/${fileName}`)
    .toString();

  try {
    blob = await put(uploadFilePath, uploadFile, {
      access: "public",
      allowOverwrite: true,
    });
  } catch (error) {
    throw new ApiError({
      message: "Failed to upload image.",
      cause: error,
    });
  }

  return blob.url;
}

export async function uploadFileLocal({
  uploadFile,
  uploadDir,
  fileNameWoExt,
  fileExt,
  uploadRootDir = "public/",
}: {
  uploadFile: File;
  uploadDir: string;
  fileNameWoExt?: string;
  fileExt?: string;
  uploadRootDir?: string;
}) {
  fileExt = fileExt ? fileExt : uploadFile.name.split(".")[1].toLowerCase();
  const fileName = fileNameWoExt
    ? `${fileNameWoExt}.${fileExt}`
    : uploadFile.name;

  const uploadPath = path.join(".", "/", uploadRootDir, uploadDir);
  const uploadFilePath = path.join(uploadPath, fileName);

  try {
    await access(uploadPath);
  } catch {
    await mkdir(uploadPath, { recursive: true });
  }

  const arrayBuffer = await uploadFile.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  await writeFile(uploadFilePath, buffer);

  const uploadUrl = path.join("/", uploadDir, fileName);

  return uploadUrl;
}

export async function deleteUploadedFile({
  uploadUrl,
  uploadRootDir,
}: {
  uploadUrl: string;
  uploadRootDir?: string;
}) {
  let result;

  // values: vercel-blob, local (fallback)
  const uploadMethod = await getEnvVariableValue("UPLOAD_METHOD");

  if (uploadMethod === "vercel-blob") {
    result = await deleteUploadedFileVercelBlob({ uploadUrl });
  } else {
    result = await deleteUploadedFileLocal({ uploadUrl, uploadRootDir });
  }

  return result;
}

export async function deleteUploadedFileVercelBlob({
  uploadUrl,
}: {
  uploadUrl: string;
}) {
  try {
    await del(uploadUrl);
  } catch (error) {
    throw new ApiError({
      message: "Failed to delete uploaded image.",
      cause: error,
    });
  }

  return true;
}

export async function deleteUploadedFileLocal({
  uploadUrl,
  uploadRootDir = "public/",
}: {
  uploadUrl: string;
  uploadRootDir?: string;
}) {
  const uploadFilePath = path.join(".", "/", uploadRootDir, uploadUrl);

  try {
    await unlink(uploadFilePath);
  } catch (error) {
    throw new ApiError({
      message: "Failed to delete uploaded image.",
      cause: error,
    });
  }

  return true;
}
