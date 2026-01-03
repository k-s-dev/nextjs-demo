import { Box, Button, TextInput } from "@mantine/core";
import styles from "./Create.module.scss";
import { useImmer } from "use-immer";
import { createTag } from "@/lib/dataModels/org/tag/dataAccessLayer";
import FormMessages from "@/lib/ui/form/FormMessages";
import { Dispatch, SetStateAction } from "react";
import * as v from "valibot";
import { VSName } from "@/lib/dataModels/org/tag/definitions";
import { FaArrowsRotate } from "react-icons/fa6";

export default function CreateTag({
  value,
  setValue,
  postCreateAction,
}: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  postCreateAction?: () => void;
}) {
  const [errors, setErrors] = useImmer<string[]>([]);

  async function handleAddTag() {
    const names = value.split(",");
    names.forEach(async (name) => {
      if (name.trim().length === 0) {
        return;
      }

      const validationResult = v.safeParse(VSName, name);
      if (!validationResult.success) {
        setErrors(
          validationResult.issues.map((issue) => issue as unknown as string),
        );
      }

      if (validationResult.success) {
        const response = await createTag({ name: name.trim() });

        if (response.status === "error") {
          response.errors?.forEach((error) => {
            setErrors((draft) => {
              draft.push(error);
            });
          });
        }

        if (response.status === "success") {
          setValue("");
          setErrors([]);
          if (postCreateAction) {
            postCreateAction();
          }
        }
      }
    });
  }

  return (
    <Box className={styles.mainContainer}>
      <TextInput
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        error={errors.length > 0 && <FormMessages error messages={errors} />}
        placeholder="comma separated tag names ..."
      />
      <Button variant="light" onClick={handleAddTag}>
        Add
      </Button>
      <Button
        variant="light"
        color="gray"
        onClick={() => {
          setValue("");
          setErrors([]);
        }}
      >
        <FaArrowsRotate />
      </Button>
    </Box>
  );
}
