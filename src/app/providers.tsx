"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthGuard>
        <SidebarProvider>
          <Toaster/>
          {children}
        </SidebarProvider>
      </AuthGuard>
    </AuthProvider>
  );
}
