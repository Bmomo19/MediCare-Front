'use client';
import React from 'react';
// import { useSidebarContext } from '@/contexts/SidebarContext';
import Header from '@/components/layout/header/Header';
import Sidebar from '@/components/layout/sidebar/Sidebar';

// Ce layout s'appliquera à toutes les routes sous le groupe (home)
export default function HomeGroupLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  // const { isMobile } = useSidebarContext();

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-y-auto">
        <Sidebar/>
        <main className='flex-1 w-full md:ml-72 md:m-8'>
          {children} 
        </main>
      </div>
    </div>
  );
}
// className={`flex-1 p-4 bg-gray-100 overflow-y-auto transition-all duration-300 ease-in-out ${!isMobile ? 'ml-64' : 'ml-0'}`}>
// flex-1 p-4 md:ml-72 md:m-8 m-2 overflow-y-auto