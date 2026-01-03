"use client";

import { InputText } from "@/lib/ui/form/fields/InputText";
import { Button, Flex, Text, Title } from "@mantine/core";
import { useActionState } from "react";
import { workspaceUpdateClientAction } from "./clientAction";
import { FaArrowsRotate } from "react-icons/fa6";
import { RichTextInput } from "@/lib/ui/form/fields/RichTextInput";
import { useTasksContext } from "@/lib/features/org/tasks/TasksContext";
import { TWorkspaceForm, TWorkspaceFormState } from "@/lib/dataModels/org/workspace/definitions";

export default function WorkspaceEditForm({
  id,
  formId,
}: {
  id: string;
  formId?: string;
}) {
  const formIdFinal = formId || "workspace-form";
  const tasksCtx = useTasksContext();
  const workspace = tasksCtx.state.workspaces.filter((workspace) => {
    return workspace.id === id;
  })[0];

  const initialFormState: TWorkspaceFormState = {
    data: { ...workspace } as TWorkspaceForm,
  };

  const [formState, formAction, isPending] = useActionState(
    workspaceUpdateClientAction.bind(null, id),
    initialFormState,
  );

  if (!workspace) {
    return null;
  }

  return (
    <div>
      <Title order={1} id="workspace">
        <Text component="span" fz={"h1"}>
          Configure Workspace:{" "}
        </Text>
        {workspace.name}
      </Title>
      <form id={formIdFinal} action={formAction}>
        <Flex direction={"column"} gap={"xs"}>
          <InputText
            formId={formIdFinal}
            required
            name="name"
            label="Name"
            placeholder="Name"
            defaultValue={formState.data?.name}
          />
          <Title order={5}>Description</Title>
          <RichTextInput
            textInputProps={{ form: formId, name: "description" }}
            initialValue={formState.data?.description || ""}
          />
          <Flex justify={"flex-end"}>
            <Button
              type="submit"
              form={formIdFinal}
              disabled={isPending}
              color="green"
              variant="light"
              w={100}
            >
              {isPending ? <FaArrowsRotate /> : "Save"}
            </Button>
          </Flex>
        </Flex>
      </form>
    </div>
  );
}
