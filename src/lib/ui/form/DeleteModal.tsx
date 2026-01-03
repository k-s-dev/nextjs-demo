"use client";

import styles from "./DeleteModal.module.scss";
import { useDisclosure } from "@mantine/hooks";
import {
  Blockquote,
  Button,
  ButtonProps,
  List,
  ListItem,
  Modal,
} from "@mantine/core";
import { useState } from "react";
import { TServerResponsePromise } from "@/lib/types/serverResponse";

const defaultErrorMessage = "Failed to delete resource. Please try again.";

export default function DeleteModalButton<GServerResponse = undefined>({
  deleteAction,
  children,
  title,
  triggerContent = "Delete",
  disabled = false,
  ...triggerProps
}: {
  deleteAction: () => TServerResponsePromise<GServerResponse>;
  children?: React.ReactNode;
  triggerContent?: React.ReactNode;
  title?: string;
  disabled?: boolean;
} & ButtonProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [errorMessages, setErrorMessages] = useState<string[] | null>(null);

  return (
    <>
      <Modal opened={opened} onClose={close} title={title} size="lg">
        {children}
        {!!errorMessages && <FailMessage errorMessages={errorMessages} />}
        <DeleteModalButtons
          closedeleteAction={close}
          deleteAction={async () => {
            let response;
            try {
              response = await deleteAction();
            } catch {
              setErrorMessages([defaultErrorMessage]);
            }
            if (response?.errors) {
              setErrorMessages(response.errors);
            }
            close();
          }}
        />
      </Modal>
      <Button
        type="button"
        disabled={disabled}
        onClick={open}
        {...{
          ...{ variant: "light", color: "red" },
          ...triggerProps,
        }}
      >
        {triggerContent}
      </Button>
    </>
  );
}

export function DeleteModalButtons({
  closedeleteAction,
  deleteAction,
  formId = "delete-modal",
}: {
  closedeleteAction: () => void;
  deleteAction: () => void;
  formId?: string;
}) {
  return (
    <section className={styles.buttonRow}>
      <form id={formId} action={deleteAction}>
        <Button
          type="submit"
          data-test-cy="delete-confirmation-button"
          color="red.1"
        >
          Confirm
        </Button>
      </form>
      <Button onClick={closedeleteAction} color="green.1">
        Cancel
      </Button>
    </section>
  );
}

function FailMessage({ errorMessages }: { errorMessages: string[] }) {
  if (errorMessages.length <= 0) return null;

  return (
    <Blockquote color="orange" mb="md">
      <List>
        {errorMessages.map((error) => {
          return <ListItem key={error}>{error}</ListItem>;
        })}
      </List>
    </Blockquote>
  );
}
