"use client";

import { Priority } from "@/generated/prisma/client";
import {
  Box,
  Button,
  Checkbox,
  CheckboxProps,
  Flex,
  Text,
  TextInput,
} from "@mantine/core";
import { ReactNode, useActionState, useState } from "react";
import { FaArrowsRotate } from "react-icons/fa6";
import DeleteModalButton from "@/lib/ui/form/DeleteModal";
import styles from "./Form.module.scss";
import { priorityClientAction } from "./actions/client";
import { Updater } from "use-immer";
import FormMessages from "@/lib/ui/form/FormMessages";
import { TWorkspaceIncludeAll } from "@/lib/dataModels/org/workspace/definitions";
import {
  TPriorityFormData,
  TPriorityFormState,
} from "@/lib/dataModels/org/priority/definitions";
import { deletePriorityById } from "@/lib/dataModels/org/priority/dataAccessLayer";

export default function PriorityFormRow({
  workspace,
  selectedIds,
  setSelectedIdsAction,
  priority,
  mode,
  randomFormId,
}: {
  workspace: TWorkspaceIncludeAll;
  selectedIds: string[];
  setSelectedIdsAction: Updater<string[]>;
  priority?: Priority;
  mode: "create" | "update";
  randomFormId?: string;
}) {
  const [resetKey, setResetKey] = useState(0);
  const formId = priority
    ? `priority-update-form-${priority.id}`
    : `priority-create-form-row-${randomFormId}`;

  const initialFormState: TPriorityFormState = {
    data: { ...priority } as TPriorityFormData,
  };

  const [formState, formAction, isPending] = useActionState(
    priorityClientAction.bind(null, priority?.id, workspace, mode),
    initialFormState,
  );

  function handleReset() {
    setResetKey((p) => p + 1);
  }

  return (
    <>
      <form key={resetKey} id={formId} action={formAction}>
        <Box className={styles.formContainer}>
          <PriorityCheckbox
            selectedIds={selectedIds}
            setSelectedIdsAction={setSelectedIdsAction}
            priority={priority}
          />
          <PriorityName formId={formId} formState={formState} />
          <PriorityCode formId={formId} formState={formState} />
          <PriorityGroup formId={formId} formState={formState} />
          <PriorityOrder formId={formId} formState={formState} />

          <SubmitButton formId={formId} isPending={isPending} mode={mode} />
          <DeleteButton priority={priority} />
          <ResetButton formId={formId} resetAction={handleReset} />
        </Box>
      </form>
      {formState.errors?.root && (
        <FormMessages error messages={formState.errors.root} />
      )}
      {formState.errors?.other && (
        <FormMessages error messages={formState.errors.other} />
      )}
      {formState.messages && <FormMessages messages={formState.messages} />}
    </>
  );
}

export function PriorityCheckbox({
  selectedIds,
  setSelectedIdsAction,
  priority,
}: {
  selectedIds: string[];
  setSelectedIdsAction: Updater<string[]>;
  priority: Priority | undefined;
}) {
  function toggleSelection() {
    if (priority) {
      if (selectedIds.includes(priority.id)) {
        setSelectedIdsAction((draft) => {
          return draft.filter((id) => id !== priority?.id);
        });
      }
      if (!selectedIds.includes(priority.id)) {
        setSelectedIdsAction((draft) => {
          draft.push(priority.id);
        });
      }
    }
  }

  return (
    <Checkbox
      checked={selectedIds.includes(priority?.id || "")}
      onClick={toggleSelection}
    />
  );
}

export function PriorityName({ formId, formState }: IFieldProps) {
  return (
    <TextInput
      form={formId}
      name="name"
      defaultValue={formState.data?.name}
      error={formState.errors?.nested?.name && formState.errors.nested.name}
    />
  );
}

export function PriorityCode({ formId, formState }: IFieldProps) {
  return (
    <TextInput
      form={formId}
      name="code"
      defaultValue={formState.data?.code}
      error={formState.errors?.nested?.code && formState.errors.nested.code}
    />
  );
}

export function PriorityGroup({ formId, formState }: IFieldProps) {
  return (
    <TextInput
      form={formId}
      type="number"
      min={1}
      max={100}
      name="group"
      defaultValue={
        formState.data?.group ? formState.data.group.toString() : ""
      }
      error={formState.errors?.nested?.group && formState.errors.nested.group}
    />
  );
}

export function PriorityOrder({ formId, formState }: IFieldProps) {
  return (
    <TextInput
      form={formId}
      type="number"
      min={1}
      max={100}
      name="order"
      defaultValue={
        formState.data?.order ? formState.data.order.toString() : ""
      }
      error={formState.errors?.nested?.order && formState.errors.nested.order}
    />
  );
}

export function PriorityFormHeader({
  toggleAllAction,
  ...checkboxProps
}: {
  toggleAllAction: () => void;
} & CheckboxProps) {
  return (
    <Box className={styles.headerContainer}>
      <HeaderCell>
        <Checkbox onClick={toggleAllAction} {...checkboxProps} />
      </HeaderCell>
      <HeaderCell>Name</HeaderCell>
      <HeaderCell>Code</HeaderCell>
      <HeaderCell>Group</HeaderCell>
      <HeaderCell>Order</HeaderCell>
      <HeaderCell>{""}</HeaderCell>
      <HeaderCell>{""}</HeaderCell>
      <HeaderCell>{""}</HeaderCell>
    </Box>
  );
}

function HeaderCell({ children }: { children: ReactNode }) {
  return (
    <Text component="span" fz={"xl"} fw={"bold"} c={"gray"}>
      {children}
    </Text>
  );
}

function SubmitButton({
  formId,
  isPending,
  mode,
}: {
  formId: string;
  isPending: boolean;
  mode: "create" | "update";
}) {
  return (
    <Button
      type="submit"
      form={formId}
      disabled={isPending}
      color="green"
      variant="light"
    >
      <Flex display={"inline-flex"} gap={"xs"}>
        {mode === "create" ? "Add" : "Save"} {isPending && <FaArrowsRotate />}
      </Flex>
    </Button>
  );
}

function ResetButton({
  formId,
  resetAction,
}: {
  resetAction: () => void;
} & TButtonProps) {
  return (
    <Button form={formId} onClick={resetAction} color="gray" variant="light">
      Reset
    </Button>
  );
}

function DeleteButton({ priority }: { priority?: Priority }) {
  return (
    <DeleteModalButton
      deleteAction={async () => {
        let response;
        if (priority) {
          response = await deletePriorityById(priority.id);
        }
        return {
          status: response?.status || "error",
          errors: response?.errors || [],
        };
      }}
      color="red"
      variant="light"
    >
      <Text fz={"xl"} c={"red"}>
        Priority {priority?.name} will be deleted permanently.
      </Text>
    </DeleteModalButton>
  );
}

type TButtonProps = {
  formId: string;
};

interface IFieldProps {
  formId: string;
  formState: TPriorityFormState;
}
