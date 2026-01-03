"use client";

import { ReactNode } from "react";
import clsx from "clsx";
import { useLayoutContext } from "./Layout";
import styles from "./PhoneUp.module.scss";
import { Flex, Text } from "@mantine/core";
import {
  FaAngleLeft,
  FaAngleRight,
  FaAnglesLeft,
  FaAnglesRight,
} from "react-icons/fa6";

export function PhoneUp({ children }: { children?: ReactNode }) {
  const state = useLayoutContext();

  let collapsed;
  if (!state.left.isOpen && state.right.isOpen) collapsed = "left";
  if (state.left.isOpen && !state.right.isOpen) collapsed = "right";
  if (!state.left.isOpen && !state.right.isOpen) collapsed = "both";

  return (
    <div
      className={clsx(
        styles.root,
        collapsed === "left" && styles.rootLeftCollapsed,
        collapsed === "right" && styles.rootRightCollapsed,
        collapsed === "both" && styles.rootBothCollapsed,
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

  const icons = (
    <section className={styles.toggle}>
      <Flex
        direction={state.left.isOpen ? "row" : "column-reverse"}
        justify={"flex-end"}
        mb={"xs"}
        gap={"md"}
      >
        <Text
          component={state.left.isOpen ? FaAnglesLeft : FaAnglesRight}
          c={"gray"}
          fz={"xl"}
          onClick={() => {
            state.left.toggle();
            state.right.toggle();
          }}
        />
        <Text
          component={state.left.isOpen ? FaAngleLeft : FaAngleRight}
          c={"gray"}
          fz={"xl"}
          onClick={state.left.toggle}
        />
      </Flex>
    </section>
  );

  return (
    <div
      className={clsx(
        styles.sidebar,
        styles.left,
        state.left.isOpen && styles.leftOpen,
      )}
    >
      <Flex direction={"column"} justify={"space-between"} h={"100%"}>
        {icons}
        <div
          className={clsx(
            styles.sidebarContent,
            !state.left.isOpen && styles.hide,
          )}
        >
          {children}
        </div>
        {icons}
      </Flex>
    </div>
  );
}

export function RightPhoneUp({ children }: { children?: ReactNode }) {
  const state = useLayoutContext();
  const icons = (
    <section className={styles.toggle}>
      <Flex
        direction={state.right.isOpen ? "row" : "column"}
        justify={"flex-start"}
        mb={"xs"}
        gap={"md"}
      >
        <Text
          component={state.right.isOpen ? FaAngleRight : FaAngleLeft}
          c={"gray"}
          fz={"xl"}
          onClick={state.right.toggle}
        />
        <Text
          component={state.right.isOpen ? FaAnglesRight : FaAnglesLeft}
          c={"gray"}
          fz={"xl"}
          onClick={() => {
            state.right.toggle();
            state.left.toggle();
          }}
        />
      </Flex>
    </section>
  );

  return (
    <div
      className={clsx(
        styles.sidebar,
        styles.right,
        state.right.isOpen && styles.rightOpen,
      )}
    >
      <Flex direction={"column"} justify={"space-between"} h={"100%"}>
        {icons}
        <div
          className={clsx(
            styles.sidebarContent,
            !state.right.isOpen && styles.hide,
          )}
        >
          {children}
        </div>
        {icons}
      </Flex>
    </div>
  );
}
