"use client";

import { createContext, ReactNode, useContext } from "react";
import { LeftPhone, MainPhone, Phone } from "./Phone";
import { LeftPhoneUp, MainPhoneUp, PhoneUp } from "./PhoneUp";
import { useDisclosure } from "@mantine/hooks";
import { useGetMedia } from "@/lib/ui/hooks/useGetMedia";

export const LayoutContext = createContext<ILayoutContext | null>(null);

export function useLayoutContext() {
  const layoutCtx = useContext(LayoutContext);
  if (!layoutCtx) {
    throw new Error("Layout context not initialized.");
  }
  return layoutCtx;
}

export function LayoutContextProvider({
  children,
  initialOpen = false,
}: {
  children: ReactNode;
  initialOpen: boolean;
}) {
  const [isOpenLeft, { open: openLeft, close: closeLeft, toggle: toggleLeft }] =
    useDisclosure(initialOpen);
  const [
    isOpenRight,
    { open: openRight, close: closeRight, toggle: toggleRight },
  ] = useDisclosure(initialOpen);

  const initialCtx = {
    left: {
      isOpen: isOpenLeft,
      open: openLeft,
      close: closeLeft,
      toggle: toggleLeft,
    },
    right: {
      isOpen: isOpenRight,
      open: openRight,
      close: closeRight,
      toggle: toggleRight,
    },
  };

  return (
    <LayoutContext.Provider value={initialCtx}>
      {children}
    </LayoutContext.Provider>
  );
}

/**
 * Layout with left collapsible sidebar.
 *
 * @param openSm - boolean indicating whether to open sidebar by default on Phone
 * @param openXl - boolean indicating whether to open sidebar by default on PhoneUp
 * @returns Type and description of the returned object.
 *
 * @example
 * ```
 * Write me later.
 * ```
 */
export function Layout01({
  children,
  openSm = false,
  openXl = true,
}: {
  children: ReactNode;
  openSm?: boolean;
  openXl?: boolean;
}) {
  const media = useGetMedia();

  return (
    <>
      {media.isPhone && (
        <LayoutContextProvider initialOpen={openSm}>
          <Phone>{children}</Phone>
        </LayoutContextProvider>
      )}
      {!media.isPhone && (
        <LayoutContextProvider initialOpen={openXl}>
          <PhoneUp>{children}</PhoneUp>
        </LayoutContextProvider>
      )}
    </>
  );
}

export function Layout01Main({ children }: { children?: ReactNode }) {
  const media = useGetMedia();

  return (
    <>
      {media.isPhone && <MainPhone>{children}</MainPhone>}
      {!media.isPhone && <MainPhoneUp>{children}</MainPhoneUp>}
    </>
  );
}

export function Layout01Left({ children }: { children?: ReactNode }) {
  const media = useGetMedia();

  return (
    <>
      {media.isPhone && <LeftPhone>{children}</LeftPhone>}
      {!media.isPhone && <LeftPhoneUp>{children}</LeftPhoneUp>}
    </>
  );
}

export interface ILayoutContext {
  left: {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
  };
}
