"use client";

import { ReactNode } from "react";
import clsx from "clsx";
import { useLayoutContext } from "./Layout";
import styles from "./Phone.module.scss";
import { Flex, Text } from "@mantine/core";
import { FaAnglesDown, FaAnglesUp } from "react-icons/fa6";

export function Phone({ children }: { children?: ReactNode }) {
  const state = useLayoutContext();

  return (
    <div className={clsx(styles.root)}>
      <div className={clsx(styles.sidebarsToggleContainer)}>
        <Flex justify={"space-between"}>
          <Text
            component={!state.left.isOpen ? FaAnglesDown : FaAnglesUp}
            c={"gray"}
            onClick={() => {
              state.right.close();
              state.left.toggle();
            }}
            className={clsx(styles.toggle)}
          />
          <Text
            component={!state.right.isOpen ? FaAnglesDown : FaAnglesUp}
            c={"gray"}
            onClick={() => {
              state.left.close();
              state.right.toggle();
            }}
            className={clsx(styles.toggle)}
          />
        </Flex>
      </div>
      {children}
    </div>
  );
}

export function MainPhone({ children }: { children?: ReactNode }) {
  return <div className={clsx(styles.main)}>{children}</div>;
}

export function LeftPhone({ children }: { children?: ReactNode }) {
  const state = useLayoutContext();

  return (
    <div className={clsx(styles.left, !state.left.isOpen && styles.hide)}>
      {children}
    </div>
  );
}

export function RightPhone({ children }: { children?: ReactNode }) {
  const state = useLayoutContext();

  return (
    <div className={clsx(styles.right, !state.right.isOpen && styles.hide)}>
      {children}
    </div>
  );
}
