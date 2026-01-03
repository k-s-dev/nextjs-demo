"use client";

import { Text, TextProps, Tooltip, TooltipProps } from "@mantine/core";
import { IconBase } from "react-icons/lib";
import styles from "./TooltipIcon.module.scss";
import { ComponentProps } from "react";

export default function TooltipIcon<C extends React.ElementType>({
  label,
  component,
  tooltipProps,
  textProps,
  ...iconProps
}: TTooltipIconProps<C>) {
  const Icon = component || IconBase;

  return (
    <Tooltip {...{ ...{ label, className: styles.tooltip }, ...tooltipProps }}>
      <Text
        {...{
          ...{
            component: "span",
            className: styles.container,
            fz: "xl",
          },
          ...textProps,
        }}
      >
        <Icon {...iconProps} />
      </Text>
    </Tooltip>
  );
}

export type TTooltipIconProps<C extends React.ElementType> = {
  label: string;
  component?: C;
  tooltipProps?: TooltipProps;
  textProps?: TextProps & ComponentProps<"span"> & { [k: string]: unknown };
} & React.ComponentPropsWithoutRef<C>;
