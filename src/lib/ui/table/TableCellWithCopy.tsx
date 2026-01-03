import CopyIcon from "../icons/CopyIcon";
import { Flex, Text, TextProps } from "@mantine/core";

export default function TableCellWithCopy({
  text,
  children,
  copyText,
  ...attrs
}: {
  text?: string;
  children?: React.ReactNode;
  copyText?: string;
} & TextProps) {
  return (
    <>
      <Flex display={"inline-flex"} gap={"xs"}>
        {children}
        {text && (
          <Text component="span" {...attrs}>
            {text}
          </Text>
        )}
        {(copyText || text) && <CopyIcon copyText={copyText || text || ""} />}
      </Flex>
    </>
  );
}
