import { MantineProvider } from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import { theme } from "./theme";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={theme}>
      <SessionProvider>{children}</SessionProvider>
    </MantineProvider>
  );
}
