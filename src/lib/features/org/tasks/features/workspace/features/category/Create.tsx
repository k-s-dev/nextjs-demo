import { Box, Button, TextInput } from "@mantine/core";
import styles from "./Create.module.scss";
import { useImmer } from "use-immer";
import FormMessages from "@/lib/ui/form/FormMessages";
import { Dispatch, SetStateAction, useState } from "react";
import { createCategory } from "@/lib/dataModels/org/category/dataAccessLayer";
import { FaArrowsRotate } from "react-icons/fa6";

export default function CreateCategory({
  value,
  setValue,
  workspaceId,
  parentId,
  postAddAction = () => {},
}: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  workspaceId: string;
  parentId?: string | null;
  postAddAction?: () => void;
}) {
  const [errors, setErrors] = useImmer<string[]>([]);
  const [resetKey, setResetKey] = useState(0);

  async function handleAddTag() {
    const names = value.split(",");
    names.forEach(async (name) => {
      if (name.trim().length === 0) return;
      const response = await createCategory(
        {
          name: name.trim(),
        },
        workspaceId,
        parentId,
      );

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
        setResetKey((p) => p + 1);
        postAddAction();
      }
    });
  }

  return (
    <Box className={styles.mainContainer}>
      <TextInput
        key={resetKey}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        error={errors.length > 0 && <FormMessages error messages={errors} />}
        placeholder="comma separated category names ..."
      />
      <Button variant="light" onClick={handleAddTag} maw={150}>
        Add
      </Button>
      <Button
        variant="light"
        color="gray"
        maw={150}
        onClick={() => {
          setValue("");
          setErrors([]);
          setResetKey((p) => p + 1);
        }}
      >
        <FaArrowsRotate />
      </Button>
    </Box>
  );
}
