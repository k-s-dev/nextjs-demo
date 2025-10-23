import styles from "./AdminFormHeader.module.scss";
import { Divider, Text } from "@mantine/core";

export default function AdminFormHeaderContainer({
  modelName,
  mode,
  children,
}: {
  modelName: string;
  mode: "create" | "list" | "detail" | "update";
  children?: React.ReactNode;
}) {
  return (
    <>
      <header className={styles.header}>
        <Text component="h1" fz="h1">
          <Text component="span" tt="capitalize" inherit c="green.7">
            {modelName}
          </Text>
          <Text component="span" tt="capitalize" inherit c="gray.6">
            {" : "}
            {mode}
          </Text>
        </Text>
        {children}
      </header>

      <Divider size="md" my="sm" />
    </>
  );
}
