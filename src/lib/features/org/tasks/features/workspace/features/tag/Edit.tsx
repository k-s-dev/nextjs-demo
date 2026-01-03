import { Card, Checkbox, Flex, TextInput } from "@mantine/core";
import { useState } from "react";
import { Updater, useImmer } from "use-immer";
import {
  deleteTagById,
  updateTagById,
} from "@/lib/dataModels/org/tag/dataAccessLayer";
import FormMessages from "@/lib/ui/form/FormMessages";
import { Tag } from "@/generated/prisma/client";
import DeleteModalIcon from "@/lib/ui/form/DeleteModalIcon";
import { SaveIcon } from "@/lib/ui/icons/TooltipIcons";

export default function EditTag({
  tag,
  selected,
  setSelectionAction,
}: {
  tag: Tag;
  selected: boolean;
  setSelectionAction: Updater<string[]>;
}) {
  const [value, setValue] = useState(tag.name);
  const [errors, setErrors] = useImmer<string[]>([]);

  async function handleEdit() {
    const response = await updateTagById(tag.id, { name: value });

    if (response.status === "error") {
      response.errors?.forEach((error) => {
        setErrors((draft) => {
          draft.push(error);
        });
      });
    }
  }

  async function handleDelete() {
    const response = await deleteTagById(tag.id);

    if (response.status === "error") {
      response.errors?.forEach((error) => {
        setErrors((draft) => {
          draft.push(error);
        });
      });
    }

    return response;
  }

  function toggleSelection() {
    if (!selected)
      setSelectionAction((draft) => {
        draft.push(tag.id);
      });
    if (selected)
      setSelectionAction((draft) => {
        const idx = draft.findIndex((id) => id === tag.id);
        draft.splice(idx, 1);
      });
  }

  return (
    <Card shadow="md" maw={250} p={5}>
      <Flex gap={"xs"} align={"center"}>
        <Checkbox checked={selected} onChange={toggleSelection} />
        <TextInput
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          error={errors.length > 0 && <FormMessages error messages={errors} />}
        />
        <SaveIcon action={handleEdit} />
        <DeleteModalIcon
          deleteAction={handleDelete}
          title={`Confirm to delete tag: ${tag.name}`}
        />
      </Flex>
    </Card>
  );
}
