import { Dispatch, SetStateAction } from "react";
import Image from "next/image";

import "./InputImage.scss";
import FormControl from "../control/FormControl";

export function InputImage({
  formId,
  imageFile,
  setImageFile,
  initialImageUrl,
  errors,
  fieldName = "imageFile",
  fieldLabel = "Pick image",
  fieldPlaceholder = "Image",
  fieldId = "imageFile",
}: {
  formId: string;
  imageFile: File | null;
  setImageFile: Dispatch<SetStateAction<File | null>>;
  initialImageUrl?: string;
  errors?: string[];
  fieldName?: string;
  fieldLabel?: string;
  fieldPlaceholder?: string;
  fieldId?: string;
}) {
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    let files;
    const target = e.target as HTMLInputElement;
    if (target) files = target.files;
    if (files) setImageFile(files[0]);
  }

  const fileName =
    imageFile?.name || initialImageUrl?.split("/").slice(-1) || "...";

  let img;
  if (imageFile && imageFile.size > 0) {
    img = (
      <Image
        src={URL.createObjectURL(imageFile)}
        alt=""
        className="form-image"
        fill
      />
    );
  } else {
    if (initialImageUrl) {
      img = <Image src={`${initialImageUrl}?q=${new Date()}`} alt="" className="form-image" fill />;
    } else {
      img = <div className="form-image-fill"></div>;
    }
  }

  return (
    <>
      <div className="form-image-field">
        <FormControl errors={errors}>
          <div className="form-image-container">{img}</div>
          <div>File name: {fileName}</div>
          <label htmlFor={fieldId} className="form-image-label">
            {fieldLabel}
          </label>
          <input
            hidden
            form={formId}
            type="file"
            id={fieldId}
            name={fieldName}
            placeholder={fieldPlaceholder}
            accept="image/*"
            onChange={handleFileChange}
          />
        </FormControl>
      </div>
    </>
  );
}
