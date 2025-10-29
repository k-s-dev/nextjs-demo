import styles from "./InputImage.module.scss";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import FormControl from "../control/FormControl";
import TooltipIcon from "../../icons/TooltipIcon";
import { FaX } from "react-icons/fa6";
import { Flex } from "@mantine/core";

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
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    if (initialImageUrl) {
      setImageUrl(initialImageUrl)
    }
  }, [initialImageUrl])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    let files;
    const target = e.target as HTMLInputElement;
    if (target) files = target.files;
    if (files) setImageFile(files[0]);
  }

  const fileName =
    imageFile?.name || imageUrl?.split("/").slice(-1) || "...";

  let img;
  if (imageFile && imageFile.size > 0) {
    img = (
      <Image
        src={URL.createObjectURL(imageFile)}
        alt=""
        className={styles.image}
        fill
      />
    );
  } else {
    if (imageUrl) {
      img = (
        <Image
          src={`${imageUrl}?q=${new Date()}`}
          alt=""
          className={styles.image}
          fill
        />
      );
    } else {
      img = <div></div>;
    }
  }

  return (
    <>
      <div className={styles.field}>
        <FormControl errorsProps={{ errors }}>
          <div className={styles.imagecontainer}>{img}</div>
          <div>File name: {fileName}</div>
          <Flex justify="space-between" align="center" gap="md">
            <label
              htmlFor={fieldId}
              className={styles.imageLabel}
              style={{ flexGrow: 1 }}
            >
              {fieldLabel}
            </label>
            <TooltipIcon
              textProps={{ c: "red" }}
              tooltipProps={{
                label: "Clear",
                onClick: () => {
                  setImageFile(null);
                  setImageUrl(null);
                },
              }}
            >
              <FaX />
            </TooltipIcon>
          </Flex>
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
