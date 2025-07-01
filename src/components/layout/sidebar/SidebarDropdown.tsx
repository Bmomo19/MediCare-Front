'use client';

import React, { useState, ReactNode } from 'react';
import { ChevronDownIcon, IconProps } from './menu/icons.menu';

interface SidebarDropdownProps {
  title: string;
  icon: React.FC<IconProps>; // Accepte un composant d'icône React
  children: ReactNode;
  defaultOpen?: boolean;
}

const SidebarDropdown: React.FC<SidebarDropdownProps> = ({
  title,
  icon: IconComponent, // Renomme la prop 'icon' en 'IconComponent' pour la rendre
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="space-y-1">
      <button
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none"
        aria-expanded={isOpen}
        aria-controls={`${title.toLowerCase()}-dropdown`}
        onClick={toggleDropdown}
      >
        <div className="flex items-center">
          <IconComponent className="h-5 w-5 mr-3 text-indigo-300" /> {/* Utilisation du composant d'icône */}
          {title}
        </div>
        <ChevronDownIcon
          className={`ml-2 h-5 w-5 transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        id={`${title.toLowerCase()}-dropdown`}
        className={`space-y-1 pl-11 ${isOpen ? '' : 'hidden'}`}
      >
        {children}
      </div>
    </div>
  );
};

export default SidebarDropdown;
