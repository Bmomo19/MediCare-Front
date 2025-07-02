'use client';

import React, { useState, ReactNode, useEffect } from 'react';
import { ChevronDownIcon, IconProps } from './menu/icons.menu';

interface SidebarDropdownProps {
  title: string;
  icon: React.FC<IconProps>;
  children: ReactNode;
  defaultOpen?: boolean;
  hasActiveChild?: boolean;
}

const SidebarDropdown: React.FC<SidebarDropdownProps> = ({
  title,
  icon: IconComponent,
  children,
  defaultOpen = false,
  hasActiveChild = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen || hasActiveChild);

  useEffect(() => {
    if (hasActiveChild) {
      setIsOpen(true);
    } else {
      setIsOpen(defaultOpen);
    }
  }, [hasActiveChild, defaultOpen]);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const buttonClasses = `
    w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-lg
    ${hasActiveChild ? 'bg-indigo-700 text-indigo-100' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
    focus:outline-none transition-colors duration-200
  `;

  return (
    <div className="space-y-1">
      <button className={buttonClasses} aria-expanded={isOpen} aria-controls={`${title.toLowerCase()}-dropdown`} onClick={toggleDropdown}>
        <div className="flex items-center">
          <IconComponent className="h-5 w-5 mr-3" />
          {title}
        </div>
        <ChevronDownIcon className={`ml-2 h-5 w-5 transform transition-transform duration-200 ${ isOpen ? 'rotate-180' : ''}`}/>
      </button>
      <div id={`${title.toLowerCase()}-dropdown`} className={`space-y-1 pl-11 ${isOpen ? '' : 'hidden'}`}>
        {children}
      </div>
    </div>
  );
};

export default SidebarDropdown;
