"use client";

import { Status } from "@/generated/prisma/client";
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
import { statusClientAction } from "./actions/client";
import { Updater } from "use-immer";
import FormMessages from "@/lib/ui/form/FormMessages";
import { TWorkspaceIncludeAll } from "@/lib/dataModels/org/workspace/definitions";
import {
  TStatusFormData,
  TStatusFormState,
} from "@/lib/dataModels/org/status/definitions";
import { deleteStatusById } from "@/lib/dataModels/org/status/dataAccessLayer";

export default function StatusFormRow({
  workspace,
  selectedIds,
  setSelectedIdsAction,
  status,
  mode,
  randomFormId,
}: {
  workspace: TWorkspaceIncludeAll;
  selectedIds: string[];
  setSelectedIdsAction: Updater<string[]>;
  status?: Status;
  mode: "create" | "update";
  randomFormId?: string;
}) {
  const [resetKey, setResetKey] = useState(0);
  const formId = status
    ? `status-update-form-${status.id}`
    : `status-create-form-row-${randomFormId}`;

  const initialFormState: TStatusFormState = {
    data: { ...status } as TStatusFormData,
  };

  const [formState, formAction, isPending] = useActionState(
    statusClientAction.bind(null, status?.id, workspace, mode),
    initialFormState,
  );

  function handleReset() {
    setResetKey((p) => p + 1);
  }

  return (
    <>
      <form key={resetKey} id={formId} action={formAction}>
        <Box className={styles.formContainer}>
          <StatusCheckbox
            selectedIds={selectedIds}
            setSelectedIdsAction={setSelectedIdsAction}
            status={status}
          />
          <StatusName formId={formId} formState={formState} />
          <StatusCode formId={formId} formState={formState} />
          <StatusGroup formId={formId} formState={formState} />
          <StatusOrder formId={formId} formState={formState} />

          <SubmitButton formId={formId} isPending={isPending} mode={mode} />
          <DeleteButton status={status} />
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

export function StatusCheckbox({
  selectedIds,
  setSelectedIdsAction,
  status,
}: {
  selectedIds: string[];
  setSelectedIdsAction: Updater<string[]>;
  status: Status | undefined;
}) {
  function toggleSelection() {
    if (status) {
      if (selectedIds.includes(status.id)) {
        setSelectedIdsAction((draft) => {
          return draft.filter((id) => id !== status?.id);
        });
      }
      if (!selectedIds.includes(status.id)) {
        setSelectedIdsAction((draft) => {
          draft.push(status.id);
        });
      }
    }
  }

  return (
    <Checkbox
      checked={selectedIds.includes(status?.id || "")}
      onClick={toggleSelection}
    />
  );
}

export function StatusName({ formId, formState }: IFieldProps) {
  return (
    <TextInput
      form={formId}
      name="name"
      defaultValue={formState.data?.name}
      error={formState.errors?.nested?.name && formState.errors.nested.name}
    />
  );
}

export function StatusCode({ formId, formState }: IFieldProps) {
  return (
    <TextInput
      form={formId}
      name="code"
      defaultValue={formState.data?.code}
      error={formState.errors?.nested?.code && formState.errors.nested.code}
    />
  );
}

export function StatusGroup({ formId, formState }: IFieldProps) {
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

export function StatusOrder({ formId, formState }: IFieldProps) {
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

export function StatusFormHeader({
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

function DeleteButton({ status }: { status?: Status }) {
  return (
    <DeleteModalButton
      deleteAction={async () => {
        let response;
        if (status) {
          response = await deleteStatusById(status.id);
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
        Status {status?.name} will be deleted permanently.
      </Text>
    </DeleteModalButton>
  );
}

type TButtonProps = {
  formId: string;
};

interface IFieldProps {
  formId: string;
  formState: TStatusFormState;
}
