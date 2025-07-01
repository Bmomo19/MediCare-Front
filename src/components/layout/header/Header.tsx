'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext'; // Assurez-vous que le chemin est correct
import { useSidebarContext } from '@/contexts/SidebarContext'; // Importe le contexte de la sidebar
import { MenuIcon, ProfileIcon, LogoutIcon } from '../sidebar/menu/icons.menu'; // Importe les icônes

const Header: React.FC = () => {
  const { logout } = useAuth();
  const { toggleSidebar, isMobile } = useSidebarContext(); // Utilise le contexte de la sidebar

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center z-30 relative md:static rounded-b-lg">
      <div className="flex items-center">
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="p-2 mr-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Toggle sidebar"
          >
            <MenuIcon className="h-6 w-6 text-gray-700" />
          </button>
        )}
        {/* Logo ou titre de l'application */}
        <Link href="/dashboard" className="text-2xl font-extrabold text-indigo-600 hover:text-indigo-800 transition-colors">
          MediCare
        </Link>
      </div>

      {/* Liens de navigation */}
      <nav>
        <ul className="flex items-center space-x-6">
          <li>
            <Link href="/profile" className="flex items-center text-gray-700 hover:text-indigo-600 font-medium transition-colors">
              <ProfileIcon className="h-5 w-5 mr-1" />
              Profil
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center text-red-600 hover:text-red-800 font-medium transition-colors focus:outline-none"
            >
              <LogoutIcon className="h-5 w-5 mr-1" />
              Déconnexion
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
