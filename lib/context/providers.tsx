"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { SnackbarProvider } from "notistack";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={1000}
      >
        {children}
      </SnackbarProvider>
    </SessionProvider>
  );
}
