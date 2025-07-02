import * as Icons from "./icons.menu"; 
import * as URL from "@/lib/constant"; 


export interface NavItem {
  title: string;
  url: string;
  icon?: React.FC<Icons.IconProps>; 
}

export interface NavGroup {
  title: string;
  icon: React.FC<Icons.IconProps>;
  url?: string;
  items: NavItem[];
  defaultOpen?: boolean;
}

// Données de navigation
export const NAV_DATA: (NavItem | NavGroup)[] = [
  {
    title: "Tableau de bord",
    icon: Icons.DashboardIcon,
    defaultOpen: true,
    items: [
      {
        title: "Admin",
        url: URL.APPLINKS.DASHBOARD_ADMIN,
      },
      {
        title: "Docteur",
        url: URL.APPLINKS.DASHBOARD_DOCTOR,
      },
      {
        title: "Patient",
        url: URL.APPLINKS.DAHSBOARD_PATIENT,
      },
    ],
  },
  {
    title: "Docteurs",
    url: URL.APPLINKS.DOCTOR,
    icon: Icons.UsersIcon,
    items: [],
  },
  {
    title: "Patients",
    url: URL.APPLINKS.PATIENT,
    icon: Icons.ProfileIcon,
    items: [],
  },
  // Ajoutez d'autres éléments de navigation ici si nécessaire
];
