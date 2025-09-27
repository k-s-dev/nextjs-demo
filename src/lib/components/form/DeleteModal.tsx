"use client";

import "./DeleteModal.scss";

import { useDisclosure } from "@mantine/hooks";
import DeleteIcon from "../icons/DeleteIcon";
import { Blockquote, Modal } from "@mantine/core";
import { useEffect, useState } from "react";

export default function DeleteModal({
  resource,
  identifier,
  deleteAction,
  children,
  title = "Delete Confirmation",
  tooltipLabel = "Delete",
  disabled = false,
  btnClassName = "icon",
}: {
  resource: string;
  identifier: string;
  deleteAction: () => Promise<"success" | "failed">;
  children?: React.ReactNode;
  title?: string;
  tooltipLabel?: string;
  disabled?: boolean;
  btnClassName?: string;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const [showFailMessage, setShowFailMessage] = useState<boolean>(false);

  useEffect(() => {
    setShowFailMessage(false);
  }, [opened]);

  return (
    <>
      <Modal opened={opened} onClose={close} title={title} size="lg">
        <DeleteModalContent
          closeAction={close}
          resource={resource}
          identifier={identifier}
          deleteAction={async () => {
            const result = await deleteAction();
            if (result === "failed") {
              setShowFailMessage(true);
            } else {
              close();
            }
          }}
        >
          {children}
          {showFailMessage && <FailMessage />}
        </DeleteModalContent>
      </Modal>
      <button
        type="button"
        disabled={disabled}
        onClick={open}
        className={btnClassName}
      >
        <DeleteIcon label={tooltipLabel} />
      </button>
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
    <section className="delete-modal-section">
      <h4>This is a destructive action!</h4>

      <p>
        <span className="delete-modal-resource">{resource || "Resource"}</span>
        {": "}
        <span className="delete-modal-identifier">{identifier}</span>{" "}
      </p>

      <p>
        will be{" "}
        <span className="delete-modal-highlight">permanently deleted.</span>
      </p>

      <p>
        To <i>Confirm</i>, press <i>confirm button</i>.
      </p>

      <p>
        To <i>Cancel</i>, press <i>cancel button</i> or press &quot;Esc&quot;
        key.
      </p>

      {children}

      <section className="delete-modal-btn-row">
        <form id={identifier} action={deleteAction}>
          <button className="delete-modal-btn--confirm">Confirm</button>
        </form>

        <button className="delete-modal-btn--cancel" onClick={closeAction}>
          Cancel
        </button>
      </section>
    </section>
  );
}

function FailMessage() {
  return (
    <Blockquote color="orange" mb="md" >
      Failed to delete resource. Please try again.
    </Blockquote>
  );
}
