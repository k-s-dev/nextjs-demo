"use client";

import { Session } from "@/lib/features/authentication/auth-client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

export const SessionContext = createContext<ISessionContext | null>(null);

export function useSessionContext() {
  const sessionCtx = useContext(SessionContext);
  if (!sessionCtx) {
    throw new Error("Session context is null.");
  }
  return sessionCtx;
}

export function SessionProvider({
  sessionData,
  children,
}: {
  sessionData: TSessionData;
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<TSessionData>(sessionData);

  return (
    <SessionContext.Provider value={{ data: session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export type TSessionData = Session | null;

export interface ISessionContext {
  data: TSessionData;
  setSession: Dispatch<SetStateAction<TSessionData>>;
}
