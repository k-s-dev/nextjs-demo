"use client";

import { ReactNode } from "react";
import clsx from "clsx";
import { useLayoutContext } from "./Layout";
import styles from "./PhoneUp.module.scss";
import { Flex, Text } from "@mantine/core";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

export function PhoneUp({ children }: { children?: ReactNode }) {
  const state = useLayoutContext();

  return (
    <div
      className={clsx(
        styles.root,
        !state.left.isOpen && styles.rootLeftCollapsed,
      )}
    >
      {children}
    </div>
  );
}

export function MainPhoneUp({ children }: { children?: ReactNode }) {
  return <div className={clsx(styles.main)}>{children}</div>;
}

export function LeftPhoneUp({ children }: { children?: ReactNode }) {
  const state = useLayoutContext();

  return (
    <div
      className={clsx(
        styles.sidebar,
        styles.left,
        state.left.isOpen && styles.leftOpen,
      )}
    >
      <Flex direction={"column"} justify={"space-between"} h={"100%"}>
        <Text
          component={state.left.isOpen ? FaAngleLeft : FaAngleRight}
          c={"gray"}
          fz={"h1"}
          onClick={state.left.toggle}
          className={clsx(
            styles.toggle,
            styles.toggleTop,
            !state.left.isOpen && styles.toggleClosed,
          )}
        />
        <div
          className={clsx(
            styles.sidebarContent,
            !state.left.isOpen && styles.hide,
          )}
        >
          {children}
        </div>
        <Text
          component={state.left.isOpen ? FaAngleLeft : FaAngleRight}
          c={"gray"}
          fz={"h1"}
          onClick={state.left.toggle}
          className={clsx(
            styles.toggle,
            styles.toggleBottom,
            !state.left.isOpen && styles.toggleClosed,
          )}
        />
      </Flex>
    </div>
  );
}
