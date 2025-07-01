
import { Header } from '@/components/layout/header/Header'
import Sidebar from '@/components/layout/sidebar/Sidebar'
import React from 'react'

type Props = {
  children: React.ReactNode
}

function Layout({ children }: Props) {
  return (
    <>
      <div className="flex flex-col h-screen"> {/* Conteneur principal pour le layout */}
        <Header /> {/* Le Header est maintenant à l'intérieur de AuthGuard */}
        <div className="flex-grow flex"> {/* Conteneur pour la Sidebar et le contenu principal */}
          <Sidebar> {/* La Sidebar enveloppe le contenu spécifique de la page */}
            {children} {/* Les pages rendues par Next.js */}
          </Sidebar>
        </div>
      </div>
      {/* <div className="flex min-h-screen">
        <Sidebar />

        <div className="w-full bg-gray-100">
          <Header />

          <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
            {children}
          </main>
        </div>
      </div> */}
    </>
  )
}

export default Layout