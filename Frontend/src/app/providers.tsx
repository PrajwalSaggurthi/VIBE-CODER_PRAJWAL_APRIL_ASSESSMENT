"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#0f172a",
            color: "#fff",
            fontSize: "14px",
            borderRadius: "12px",
            padding: "12px 16px",
          },
        }}
      />
    </AuthProvider>
  );
}
