"use client";

import styles from "./DeleteModal.module.scss";
import { useDisclosure } from "@mantine/hooks";
import { Blockquote, Button, List, ListItem, Modal } from "@mantine/core";
import { useState } from "react";
import { TServerResponsePromise } from "@/lib/types/serverResponse";
import { DeleteIcon, ITooltipIconsProps } from "../icons/TooltipIcons";

const defaultErrorMessage = "Failed to delete resource. Please try again.";

export default function DeleteModalIcon<GDeleteResponse = undefined>({
  deleteAction,
  children,
  title,
  tooltipLabel = "Delete",
  disabled = false,
  textProps,
  iconProps,
  tooltipProps,
}: {
  deleteAction: () => TServerResponsePromise<GDeleteResponse>;
  children?: React.ReactNode;
  title?: string;
  tooltipLabel?: string;
  disabled?: boolean;
} & ITooltipIconsProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [errorMessages, setErrorMessages] = useState<string[] | null>(null);

  return (
    <>
      <Modal opened={opened} onClose={close} title={title} size="lg">
        {children}
        {errorMessages && <FailMessage errorMessages={errorMessages} />}
        <DeleteModalButtons
          closeAction={close}
          deleteAction={async () => {
            let response;
            try {
              response = await deleteAction();
              if (response.errors) {
                setErrorMessages(response.errors);
              } else {
                close();
              }
            } catch (error) {
              setErrorMessages([JSON.stringify(error)]);
            }
          }}
        />
      </Modal>

      <DeleteIcon
        label={tooltipLabel}
        textProps={{
          onClick: open,
          c: disabled ? "gray" : "red",
          ...textProps,
        }}
        iconProps={iconProps}
        tooltipProps={tooltipProps}
      />
    </>
  );
}

export function DeleteModalButtons({
  closeAction,
  deleteAction,
  formId = "delete-modal",
}: {
  closeAction: () => void;
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
      <Button onClick={closeAction} color="green.1">
        Cancel
      </Button>
    </section>
  );
}

function FailMessage({ errorMessages }: { errorMessages?: string[] }) {
  return (
    <Blockquote color="orange" mb="md">
      <List>
        {!errorMessages && <ListItem>{defaultErrorMessage}</ListItem>}
        {errorMessages &&
          errorMessages.map((error) => {
            return <ListItem key={error}>{error}</ListItem>;
          })}
      </List>
    </Blockquote>
  );
}
