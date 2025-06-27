"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import { SidebarProvider } from "@/contexts/SidebarContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthGuard>
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </AuthGuard>
    </AuthProvider>
  );
}
