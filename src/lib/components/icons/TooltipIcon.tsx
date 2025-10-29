"use client";

import { Text, TextProps, Tooltip, TooltipProps } from "@mantine/core";
import { IconBase } from "react-icons/lib";

export default function TooltipIcon<C extends React.ElementType>({
  label,
  component,
  tooltipProps,
  textProps,
  ...iconProps
}: TTooltipIconProps<C>) {
  const Icon = component || IconBase;

  return (
    <Tooltip label={label} {...tooltipProps}>
      <Text fz="xl" {...textProps} style={{ cursor: "pointer" }}>
        <Icon {...iconProps} />
      </Text>
    </Tooltip>
  );
}

export type TTooltipIconProps<C extends React.ElementType> = {
  label?: string;
  component?: C;
  tooltipProps?: TooltipProps;
  textProps?: TextProps;
} & React.ComponentPropsWithoutRef<C>;
