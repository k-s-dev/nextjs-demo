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
  TextProps,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { DeleteIcon } from "../icons/TooltipIcons";
import { TServerResponsePromise } from "@/lib/utils/types";

const defaultErrorMessage = "Failed to delete resource. Please try again.";

export default function DeleteModalIcon({
  resource,
  identifier,
  deleteAction,
  children,
  title,
  tooltipLabel = "Delete",
  disabled = false,
  btnClassName = styles.buttonIcon,
  iconProps,
  ...restBtnProps
}: {
  resource: string;
  identifier: string;
  deleteAction: () => TServerResponsePromise;
  children?: React.ReactNode;
  title?: string;
  tooltipLabel?: string;
  disabled?: boolean;
  btnClassName?: string;
  iconProps?: TextProps;
  restBtnProps?: ButtonProps;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const [errorMessages, setErrorMessages] = useState<string[] | null>(null);

  useEffect(() => {
    setErrorMessages(null);
  }, [opened]);

  return (
    <>
      <Modal opened={opened} onClose={close} title={title} size="lg">
        <DeleteModalContent
          closeAction={close}
          resource={resource}
          identifier={identifier}
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
        >
          {children}
          {errorMessages && <FailMessage errorMessages={errorMessages} />}
        </DeleteModalContent>
      </Modal>
      <Button
        type="button"
        disabled={disabled}
        onClick={open}
        className={btnClassName}
        variant="transparent"
        p={0}
        {...restBtnProps}
      >
        <DeleteIcon label={tooltipLabel} textProps={iconProps} />
      </Button>
    </>
  );
}

export function DeleteModalContent({
  closeAction,
  resource,
  identifier,
  deleteAction,
  children,
}: {
  closeAction: () => void;
  resource: string;
  identifier: string;
  deleteAction: () => void;
  children?: React.ReactNode;
}) {
  return (
    <section>
      <h4 className={styles.highlight}>This is a destructive action!</h4>
      <p>
        <span className={styles.resource}>{resource || "Resource"}</span>
        {": "}
        <span className={styles.identifier}>{identifier}</span>{" "}
      </p>
      <p>
        will be <span className={styles.highlight}>permanently deleted.</span>
      </p>
      {children}
      <p>
        To <i>Confirm</i>, press <i>confirm button</i>.
      </p>
      <p>
        To <i>Cancel</i>, press <i>cancel button</i> or press &quot;Esc&quot;
        key.
      </p>
      <section className={styles.buttonRow}>
        <form id={identifier} action={deleteAction}>
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
