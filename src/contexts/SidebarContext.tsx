'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type SidebarState = "expanded" | "collapsed";

interface SidebarContextType {
  state: SidebarState;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isMobile: boolean; // Indique si l'appareil est mobile (déterminé côté client)
  isHydrated: boolean; // Indique si l'hydratation côté client est terminée
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

interface SidebarProviderProps {
  children: ReactNode;
  defaultOpen?: boolean;
}

export function SidebarProvider({ children, defaultOpen = true }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isMobile, setIsMobile] = useState(false); // Initialisé à false pour SSR
  const [isHydrated, setIsHydrated] = useState(false);

  // Détermine si l'appareil est mobile après l'hydratation
  useEffect(() => {
    setIsHydrated(true); // Marque l'hydratation comme terminée
    const checkMobile = () => {
      // Utilisation de `window.innerWidth` pour la détection mobile
      // Ajustez la valeur (par exemple 768px pour `md` breakpoint de Tailwind)
      setIsMobile(window.innerWidth < 768);
    };

    // Exécute la vérification initiale
    checkMobile();
    // Ajoute un écouteur d'événement pour les changements de taille de fenêtre
    window.addEventListener('resize', checkMobile);

    // Nettoyage de l'écouteur d'événement
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Ajuste l'état d'ouverture de la sidebar en fonction de `isMobile` et `defaultOpen`
  // S'exécute uniquement après l'hydratation (`isHydrated`)
  useEffect(() => {
    if (isHydrated) {
      if (isMobile) {
        setIsOpen(false); // Fermée par défaut sur mobile
      } else {
        setIsOpen(defaultOpen); // Ouverte par défaut sur desktop
      }
    }
  }, [isMobile, defaultOpen, isHydrated]);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const authContextValue: SidebarContextType = {
    state: isOpen ? "expanded" : "collapsed",
    isOpen,
    setIsOpen,
    isMobile,
    isHydrated,
    toggleSidebar,
  };

  return (
    <SidebarContext.Provider value={authContextValue}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext(): SidebarContextType {
  const context = useContext(SidebarContext);
  if (context === null) {
    throw new Error("useSidebarContext must be used within a SidebarProvider");
  }
  return context;
}
