"use client";

import { Popover, PopoverDropdown, PopoverTarget } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { useState } from "react";
import { FaRegCopy } from "react-icons/fa6";
import TooltipIcon from "./TooltipIcon";
import { ITooltipIconsProps } from "./TooltipIcons";

export default function CopyIcon({
  copyText,
  label = "Copy",
  tooltipProps,
  textProps,
  iconProps,
}: { copyText: string } & ITooltipIconsProps) {
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
            label={label}
            textProps={{
              c: "gray",
              fz: "xl",
              onClick: handleClick,
              ...textProps,
            }}
            tooltipProps={tooltipProps}
          >
            <FaRegCopy {...iconProps} />
          </TooltipIcon>
        </PopoverTarget>
        <PopoverDropdown>Copied</PopoverDropdown>
      </Popover>
    </>
  );
}
