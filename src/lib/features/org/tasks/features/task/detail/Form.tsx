"use client";

import { InputText } from "@/lib/ui/form/fields/InputText";
import { Button, Chip, Flex, Select, Text, Title } from "@mantine/core";
import { useActionState, useState } from "react";
import { taskUpdateClientAction } from "./clientAction";
import { FaArrowsRotate } from "react-icons/fa6";
import { RichTextInput } from "@/lib/ui/form/fields/RichTextInput";
import {
  TTaskFormData,
  TTaskFormState,
  TTaskUi,
} from "@/lib/dataModels/org/task/definitions";
import FormMessages from "@/lib/ui/form/FormMessages";
import { useTasksContext } from "../../../TasksContext";
import { DateInput } from "@mantine/dates";
import { dateFormat1 } from "@/lib/utils/format";
import TaskTagInput from "../TagInput";

export default function TaskDetailForm({
  task,
  formId,
  resetAction,
}: {
  task: TTaskUi;
  formId?: string;
  resetAction?: () => void;
}) {
  const formIdFinal = formId || "task-form";
  const [tagIds, setTagIds] = useState<string[]>(
    task.tags.map((tag) => tag.id),
  );

  const tasksCtx = useTasksContext();
  const workspace = tasksCtx.state.workspaces.find(
    (w) => w.id === task.category.workspaceId,
  );
  const statusChoices = workspace?.statuses.map((el) => {
    return { label: el.name, value: el.id };
  });
  const priorityChoices = workspace?.priorities.map((el) => {
    return { label: el.name, value: el.id };
  });

  const initialFormState: TTaskFormState = {
    data: { ...task, tags: task.tags.map((el) => el.id) } as TTaskFormData,
  };

  const [formState, formAction, isPending] = useActionState(
    taskUpdateClientAction.bind(null, task.id, task.categoryId, tagIds),
    initialFormState,
  );

  if (!task) {
    return null;
  }

  return (
    <section>
      <header>
        <Flex justify={"space-between"} align={"center"}>
          <Title order={1} id="task">
            <Text component="span" fz={"h1"}>
              Task: View/Edit Details
            </Text>
          </Title>
          <Button variant="outline" onClick={resetAction}>
            <FaArrowsRotate />
          </Button>
        </Flex>
      </header>
      <form id={formIdFinal} action={formAction}>
        <Flex direction={"column"} gap={"xs"}>
          <InputText
            formId={formIdFinal}
            required
            name="title"
            label="Title"
            placeholder="Title"
            defaultValue={formState.data?.title}
            errors={formState.errors?.nested?.title}
          />
          <Title order={5}>Description</Title>
          <RichTextInput
            textInputProps={{ form: formId, name: "description" }}
            initialValue={formState.data?.description || ""}
          />
          <Chip defaultChecked={formState.data?.is_archived}>Archived</Chip>
          <Flex gap={"xs"} wrap={"wrap"}>
            <DateInput
              name="start_date"
              label="Start Date"
              placeholder="Start Date"
              valueFormat="DD MMM YYYY"
              clearable
              defaultValue={formState.data?.start_date}
              error={formState.errors?.nested?.start_date}
              w={200}
            />
            <DateInput
              name="end_date"
              label="End Date"
              placeholder="End Date"
              valueFormat="DD MMM YYYY"
              clearable
              defaultValue={formState.data?.end_date}
              error={formState.errors?.nested?.end_date}
              w={200}
            />
            <Select
              data={statusChoices}
              defaultValue={formState.data?.statusId}
              name="statusId"
              label="Status"
              w={150}
            />
            <Select
              data={priorityChoices}
              defaultValue={formState.data?.priorityId}
              name="priorityId"
              label="Priority"
              w={150}
            />
          </Flex>
          <Flex gap={"xs"} wrap={"wrap"}>
            <DateInput
              name="estimated_start"
              label="Estimated Start Date"
              placeholder="Estimated Start Date"
              valueFormat="DD MMM YYYY"
              clearable
              defaultValue={formState.data?.estimated_start}
              error={formState.errors?.nested?.estimated_start}
              w={200}
            />
            <DateInput
              name="estimated_end"
              label="Estimated End Date"
              placeholder="Estimated End Date"
              valueFormat="DD MMM YYYY"
              clearable
              defaultValue={formState.data?.estimated_end}
              error={formState.errors?.nested?.estimated_end}
              w={200}
            />
          </Flex>
          <TaskTagInput value={tagIds} setValueAction={setTagIds} />
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
          {formState.errors?.nested?.description && (
            <FormMessages
              error
              messages={formState.errors.nested.description}
            />
          )}
          {formState.errors?.root && (
            <FormMessages error messages={formState.errors.root} />
          )}
        </Flex>
      </form>
      <Flex gap="md" mt={"md"} wrap={"wrap"}>
        <Text c={"gray"}>Created by: {tasksCtx.state.user.email}</Text>
        <Text c={"gray"}>Created at: {dateFormat1.format(task.createdAt)}</Text>
        <Text c={"gray"}>Updated at: {dateFormat1.format(task.updatedAt)}</Text>
      </Flex>
    </section>
  );
}
