'use client'; // Ce layout doit être un Client Component

import React from 'react';
import { useSidebarContext } from '@/contexts/SidebarContext'; // Importe le contexte de la sidebar
import Header from '@/components/layout/header/Header';
import Sidebar from '@/components/layout/sidebar/Sidebar';

// Ce layout s'appliquera à toutes les routes sous le groupe (home)
export default function HomeGroupLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  const { isMobile } = useSidebarContext();

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar/>
        <main className={`flex-1 p-6 bg-gray-100 overflow-y-auto transition-all duration-300 ease-in-out ${!isMobile ? 'ml-64' : 'ml-0'} /* Si desktop, ml-64. Si mobile, ml-0. */`}>
          {children} 
        </main>
      </div>
    </div>
  );
}
