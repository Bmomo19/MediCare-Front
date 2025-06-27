'use client'; // Indique que ce composant est un Client Component

import React, { useState, ReactNode } from 'react';

interface SidebarDropdownProps {
  title: string;
  icon: ReactNode; // Accepte un élément React (SVG) comme icône
  children: ReactNode; // Les éléments du menu déroulant (liens)
  defaultOpen?: boolean; // Pour contrôler l'état initial du dropdown
}

const SidebarDropdown: React.FC<SidebarDropdownProps> = ({
  title,
  icon,
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
          {icon} {/* L'icône SVG passée en prop */}
          {title}
        </div>
        <svg
          className={`ml-2 h-5 w-5 transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div
        id={`${title.toLowerCase()}-dropdown`}
        className={`space-y-1 pl-11 ${isOpen ? '' : 'hidden'}`}
      >
        {children} {/* Les liens du menu déroulant */}
      </div>
    </div>
  );
};

export default SidebarDropdown;
