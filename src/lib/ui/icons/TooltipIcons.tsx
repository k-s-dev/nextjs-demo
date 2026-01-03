"use client";

import {
  FaArrowLeft,
  FaArrowsRotate,
  FaEye,
  FaFloppyDisk,
  FaPenToSquare,
  FaPlus,
  FaTrash,
} from "react-icons/fa6";
import { TextProps, TooltipProps } from "@mantine/core";
import { IconBaseProps } from "react-icons/lib";
import TooltipIcon from "./TooltipIcon";
import { ComponentProps } from "react";

export function ViewIcon({
  label = "View/Edit",
  action,
  tooltipProps,
  textProps,
  iconProps,
}: ITooltipIconsProps) {
  return (
    <TooltipIcon
      label={label}
      textProps={{
        ...{ c: "green", fz: "xl", onClick: action },
        ...{ ...textProps },
      }}
      tooltipProps={tooltipProps}
    >
      <FaEye {...iconProps} />
    </TooltipIcon>
  );
}

export function ResetIcon({
  label = "Reset",
  action,
  tooltipProps,
  textProps,
  iconProps,
}: ITooltipIconsProps) {
  return (
    <TooltipIcon
      label={label}
      textProps={{
        ...{ c: "gray", fz: "xl", onClick: action },
        ...{ ...textProps },
      }}
      tooltipProps={tooltipProps}
    >
      <FaArrowsRotate {...iconProps} />
    </TooltipIcon>
  );
}

export function AddIcon({
  label = "Add",
  action,
  tooltipProps,
  textProps,
  iconProps,
}: ITooltipIconsProps) {
  return (
    <TooltipIcon
      label={label}
      textProps={{
        ...{ c: "green", fz: "xl", onClick: action },
        ...{ ...textProps },
      }}
      tooltipProps={tooltipProps}
    >
      <FaPlus {...iconProps} />
    </TooltipIcon>
  );
}

export function SaveIcon({
  label = "Save",
  action,
  tooltipProps,
  textProps,
  iconProps,
}: ITooltipIconsProps) {
  return (
    <TooltipIcon
      label={label}
      textProps={{
        ...{ c: "yellow", fz: "xl", onClick: action },
        ...{ ...textProps },
      }}
      tooltipProps={tooltipProps}
    >
      <FaFloppyDisk {...iconProps} />
    </TooltipIcon>
  );
}

export function EditIcon({
  label = "Edit",
  tooltipProps,
  textProps,
  iconProps,
}: ITooltipIconsProps) {
  return (
    <TooltipIcon
      label={label}
      textProps={{
        ...{ c: "yellow", fz: "xl" },
        ...{ ...textProps },
      }}
      tooltipProps={tooltipProps}
    >
      <FaPenToSquare {...iconProps} />
    </TooltipIcon>
  );
}

export function DeleteIcon({
  label = "Delete",
  tooltipProps,
  textProps,
  iconProps,
}: ITooltipIconsProps) {
  return (
    <TooltipIcon
      label={label}
      textProps={{
        ...{ c: "red", fz: "xl" },
        ...textProps,
      }}
      tooltipProps={tooltipProps}
    >
      <FaTrash {...iconProps} />
    </TooltipIcon>
  );
}

export function BackIcon({
  label = "Back",
  tooltipProps,
  textProps,
  iconProps,
}: ITooltipIconsProps) {
  return (
    <TooltipIcon
      label={label}
      textProps={{
        ...{ c: "gray", fz: "xl" },
        ...{ ...textProps },
      }}
      tooltipProps={tooltipProps}
    >
      <FaArrowLeft {...iconProps} />
    </TooltipIcon>
  );
}

export interface ITooltipIconsProps {
  label?: string;
  action?: () => void;
  tooltipProps?: TooltipProps;
  textProps?: TextProps & ComponentProps<"span"> & { [k: string]: unknown };
  iconProps?: IconBaseProps;
}
