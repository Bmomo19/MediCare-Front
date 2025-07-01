'use client';

import React from 'react';
import Link from 'next/link';
import SidebarDropdown from './SidebarDropdown';
import { useSidebarContext } from '@/contexts/SidebarContext';
import {
  DashboardIcon,
  AnalyticsIcon,
  UsersIcon,
  ProjectsIcon,
  CalendarIcon,
  DocumentsIcon,
  SettingsIcon,
  CloseIcon
} from './menu/icons.menu';
import Image from 'next/image';

const Sidebar: React.FC = () => {
  const { isOpen, isMobile, toggleSidebar } = useSidebarContext();

  return (
    <>
      {/* Overlay pour mobile lorsque la sidebar est ouverte */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-75 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col rounded-r-lg shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} /* Gère l'ouverture/fermeture sur mobile */
          md:translate-x-0 /* Sur les écrans desktop (md:), la sidebar est toujours visible */
        `}
      >
        {/* En-tête de la Sidebar */}
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

        {/* Barre de recherche */}
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              className="w-full bg-gray-800 text-white rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              placeholder="Rechercher..."
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Navigation principale */}
        <nav className="mt-5 px-2 flex-grow overflow-y-auto">
          <div className="space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg text-indigo-100 bg-indigo-700 hover:bg-indigo-600 transition-colors duration-200"
            >
              <DashboardIcon className="h-5 w-5 mr-3" />
              Tableau de bord
            </Link>

            <SidebarDropdown
              title="Analytiques"
              icon={AnalyticsIcon}
              defaultOpen={true}
            >
              <Link
                href="/analytics/overview"
                className="group flex items-center px-4 py-2 text-sm text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors duration-200"
              >
                Vue d&apos;ensemble
              </Link>
              <Link
                href="/analytics/reports"
                className="group flex items-center px-4 py-2 text-sm text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors duration-200"
              >
                Rapports
              </Link>
              <Link
                href="/analytics/statistics"
                className="group flex items-center px-4 py-2 text-sm text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors duration-200"
              >
                Statistiques
              </Link>
            </SidebarDropdown>

            <SidebarDropdown
              title="Équipe"
              icon={UsersIcon}
            >
              <Link
                href="/team/members"
                className="group flex items-center px-4 py-2 text-sm text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors duration-200"
              >
                Membres
              </Link>
              <Link
                href="/team/calendar"
                className="group flex items-center px-4 py-2 text-sm text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors duration-200"
              >
                Calendrier
              </Link>
              <Link
                href="/team/settings"
                className="group flex items-center px-4 py-2 text-sm text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors duration-200"
              >
                Paramètres
              </Link>
            </SidebarDropdown>

            <Link
              href="/projects"
              className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
            >
              <ProjectsIcon className="h-5 w-5 mr-3" />
              Projets
            </Link>

            <Link
              href="/calendar"
              className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
            >
              <CalendarIcon className="h-5 w-5 mr-3" />
              Calendrier
            </Link>

            <Link
              href="/documents"
              className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
            >
              <DocumentsIcon className="h-5 w-5 mr-3" />
              Documents
            </Link>

            <Link
              href="/settings"
              className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
            >
              <SettingsIcon className="h-5 w-5 mr-3" />
              Paramètres
            </Link>
          </div>
        </nav>

        {/* Profil utilisateur en bas de la sidebar */}
        <div className="mt-auto p-4 border-t border-gray-800">
          <div className="flex items-center">
            <Image className="h-8 w-8 rounded-full object-cover border-2 border-indigo-500" src="/images/user/user-01.png" alt="User profile"/>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Tom Cook</p>
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
