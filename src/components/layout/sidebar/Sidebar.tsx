'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import SidebarDropdown from './SidebarDropdown';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { NAV_DATA, NavGroup } from './menu/data';
import { CloseIcon } from '@/components/Icon';
import { User } from "@/types/auth";

const Sidebar: React.FC = () => {
  const { isOpen, isMobile, toggleSidebar } = useSidebarContext();
  const pathname = usePathname();

  const localUser: string | null = typeof window !== 'undefined' ? localStorage.getItem('authUser') : null;
  const user: User | null = localUser ? JSON.parse(localUser) : null;

  const isActive = (url?: string) => pathname === url;

  const hasActiveChild = (group: NavGroup) => {
    return group.items.some(item => isActive(item.url));
  };

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-75 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col rounded-r-lg shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-extrabold text-indigo-400">MediCare</span>
          </div>
          {isMobile && (
            <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <CloseIcon className="h-6 w-6 text-white" />
            </button>
          )}
        </div>

        <nav className="mt-5 px-2 flex-grow overflow-y-auto">
          <div className="space-y-2">
            {NAV_DATA.map((menuItem) => {
              if ('items' in menuItem && menuItem.items.length > 0) {
                const activeChild = hasActiveChild(menuItem);
                const IconComponent = menuItem.icon;

                return (
                  <SidebarDropdown key={menuItem.title} title={menuItem.title} icon={IconComponent} defaultOpen={menuItem.defaultOpen} hasActiveChild={activeChild}>
                    {menuItem.items.map((item) => (
                      <Link key={item.title} href={item.url} className={`group flex items-center px-4 py-2 text-sm rounded-md transition-colors duration-200
                          ${isActive(item.url) ? 'bg-indigo-400 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                        {item.title}
                      </Link>
                    ))}
                  </SidebarDropdown>
                );
              } else {
                const IconComponent = menuItem.icon;

                return (
                  <Link key={menuItem.title} href={menuItem.url || ''} className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200
                      ${isActive(menuItem?.url) ? 'bg-indigo-600 text-indigo-100' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                    {IconComponent && <IconComponent className="h-5 w-5 mr-3" />}
                    {menuItem.title}
                  </Link>
                );
              }
            })}
          </div>
        </nav>

        <div className="mt-auto p-4 border-t border-gray-800">
          <div className="flex items-center">
            <Image width={32} height={32} className="h-8 w-8 rounded-full object-cover border-2 border-indigo-500" src="/images/user/user-01.png" alt="User profile" />
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user?.fullName}</p>
              <Link href="/profile" className="text-xs text-indigo-300 hover:underline">
                Voir le profil
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
