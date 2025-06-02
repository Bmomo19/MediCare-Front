'use client';

import React from 'react';
import {Button as ButtonX} from "@heroui/button";

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}
export const Button : React.FC<ButtonProps> = ({
  children,
  onClick,
  className = '',
  disabled = false,
}) => {
  return (
    <ButtonX onPress={onClick}
      className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 ${className}`}
      disabled={disabled}
    >
      {children}
    </ButtonX>
  );
}