"use client";

import { Popover, PopoverDropdown, PopoverTarget } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { useState } from "react";
import { FaRegCopy } from "react-icons/fa6";
import TooltipIcon from "./TooltipIcon";

export default function CopyIcon({ copyText }: { copyText: string }) {
  const clipboard = useClipboard({ timeout: 500 });
  const [opened, setOpened] = useState(false);

  function handleClick() {
    clipboard.copy(copyText);
    setOpened((o) => !o);
    setTimeout(() => setOpened((o) => !o), 1000);
  }

  return (
    <>
      <Popover opened={opened} onChange={setOpened}>
        <PopoverTarget>
          <TooltipIcon
            label="Copy"
            textProps={{ c: "gray.5" }}
            tooltipProps={{ label: "Copy", onClick: handleClick }}
          >
            <FaRegCopy />
          </TooltipIcon>
        </PopoverTarget>
        <PopoverDropdown>Copied</PopoverDropdown>
      </Popover>
    </>
  );
}
