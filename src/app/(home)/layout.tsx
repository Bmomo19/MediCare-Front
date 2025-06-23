import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar/Sidebar'
import React from 'react'

type Props = {
    children : React.ReactNode
}

function Layout({children}: Props) {
  return (
    <>
        <div className="flex min-h-screen">
            <Sidebar />

            <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
              <Header />

              <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
                {children}
              </main>
            </div>
          </div>
    </>
  )
}

export default Layout