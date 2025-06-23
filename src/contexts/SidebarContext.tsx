'use client';

import { useMobile } from "@/hooks/useMobile";
import { createContext, useContext, useEffect, useState } from "react";

type SidebarState = "expanded" | "collapsed";

type SidebarContextType = {
  state: SidebarState;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isMobile: boolean; // Indique si l'appareil est mobile
  isHydrated: boolean; // Nouveau: indique si l'hydratation côté client est terminée
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

export function SidebarProvider({children, defaultOpen = true,}: { children: React.ReactNode; defaultOpen?: boolean;}) {
  // `isMobile` du hook useMobile. Cette valeur sera `false` pendant le SSR,
  // et sa vraie valeur (true/false) après exécution de son useEffect sur le client.
  const isMobile = useMobile();

  // État pour `isOpen`. Initialisé avec `defaultOpen` pour la cohérence SSR.
  // Le serveur et la première passe client rendront `isOpen` comme `defaultOpen`.
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Nouvel état pour suivre si l'hydratation côté client est terminée.
  const [isHydrated, setIsHydrated] = useState(false);

  // Effet pour marquer que le composant est hydraté. S'exécute une seule fois côté client.
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Effet pour ajuster l'état de la barre latérale en fonction de `isMobile` et `defaultOpen`.
  // Cet effet ne s'exécute QUE si `isHydrated` est vrai, c'est-à-dire après l'hydratation.
  useEffect(() => {
    if (isHydrated) { // S'assurer que nous sommes sur le client et que l'hydratation est faite
      if (isMobile) {
        setIsOpen(false); // Par défaut fermée sur mobile
      } else {
        setIsOpen(defaultOpen); // Par défaut `defaultOpen` sur desktop (souvent ouverte)
      }
    }
  }, [isMobile, defaultOpen, isHydrated]); // `isHydrated` doit être une dépendance

  function toggleSidebar() {
    setIsOpen((prev) => !prev);
  }

  return (
    <SidebarContext.Provider value={{ state: isOpen ? "expanded" : "collapsed", isOpen, setIsOpen, isMobile, isHydrated, toggleSidebar,}}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (context === null) {
    throw new Error("useSidebarContext must be used within a SidebarProvider");
  }
  return context;
}
