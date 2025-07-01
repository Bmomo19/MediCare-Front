"use client";

import Link from "next/link";
import { MenuIcon } from "./icons";
import { useSidebarContext } from "@/contexts/SidebarContext";

export function Header() {
  const { toggleSidebar } = useSidebarContext();

  return (
    <header className="bg-white shadow-md p-4 flex justify-end items-center rounded-b-lg">
      {/* <Link href="/dashboard" className="text-2xl font-bold text-gray-800 hover:text-indigo-600 transition-colors">
        MediCare
      </Link> */}

      {/* Liens de navigation */}
      <nav>
        <ul className="flex space-x-6">
          <li>
            <Link href="/profile" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
              Profil
            </Link>
          </li>
          <li>
            <button
              onClick={()=> {}}
              className="text-red-600 hover:text-red-800 font-medium transition-colors focus:outline-none"
            >
              Déconnexion
            </button>
          </li>
        </ul>
      </nav>
      {/* <button onClick={toggleSidebar} className="rounded-lg px-1.5 py-1 dark:border-stroke-dark lg:hidden">
        <MenuIcon />
        <span className="sr-only">Toggle Sidebar</span>
      </button>    
        <h1 className="mb-0.5 text-heading-5 font-bold text-dark dark:text-white">
          Dashboard
        </h1>
        <p className="font-medium">Next.js Admin Dashboard Solution</p>

      <div className="flex flex-1 items-center justify-end gap-2 min-[375px]:gap-4">
        <div className="shrink-0">
        </div>
      </div> */}
    </header>
  );
}
