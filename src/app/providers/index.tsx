"use client";

import { ReduxProvider } from "./redux-provider";
import { ThemeProvider } from "./theme-provider";
import { AuthProvider } from "./auth-provider";

export function AppProviders({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: any;
}) {
  return (
    <AuthProvider session={session}>
      <ReduxProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </ReduxProvider>
    </AuthProvider>
  );
}
