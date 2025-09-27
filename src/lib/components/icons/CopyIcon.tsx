"use client";

import "./Icons.scss";

import {
  Popover,
  PopoverDropdown,
  PopoverTarget,
  Tooltip,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { useState } from "react";
import { FaRegCopy } from "react-icons/fa6";

export default function CopyIcon({ copyText }: { copyText: string }) {
  const clipboard = useClipboard({ timeout: 500 });
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Popover opened={opened} onChange={setOpened}>
        <PopoverTarget>
          <Tooltip label="Copy">
            <button
              className="icon"
              onClick={() => {
                clipboard.copy(copyText);
                setOpened((o) => !o);
                setTimeout(() => setOpened((o) => !o), 1000);
              }}
            >
              <FaRegCopy className="icon--copy" />
            </button>
          </Tooltip>
        </PopoverTarget>
        <PopoverDropdown>Copied</PopoverDropdown>
      </Popover>
    </>
  );
}
