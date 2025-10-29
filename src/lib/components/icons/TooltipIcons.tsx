"use client";

import { FaArrowLeft, FaPenToSquare, FaTrash } from "react-icons/fa6";
import { TextProps, TooltipProps } from "@mantine/core";
import { IconBaseProps } from "react-icons/lib";
import TooltipIcon from "./TooltipIcon";

export function EditIcon({
  label = "Edit",
  tooltipProps,
  textProps,
  iconProps,
}: ITooltipIconsProps) {
  return (
    <TooltipIcon
      label={label || "Delete"}
      textProps={{ c: "yellow.5", ...textProps }}
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
      textProps={{ c: "red.5", ...textProps }}
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
      textProps={{ c: "gray.5", ...textProps }}
      tooltipProps={tooltipProps}
    >
      <FaArrowLeft {...iconProps} />
    </TooltipIcon>
  );
}

export interface ITooltipIconsProps {
  label?: string;
  tooltipProps?: TooltipProps;
  textProps?: TextProps;
  iconProps?: IconBaseProps;
}
