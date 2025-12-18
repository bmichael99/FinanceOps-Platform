import React from 'react'
import AppSideBar from '@/components/AppSideBar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Outlet } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner"
function DashboardLayout({children}: {children?: React.ReactNode}) {
  return (

    //Grid layout: Side Bar | Content
    
    <SidebarProvider>
      <AppSideBar/>

      <SidebarTrigger className='absolute top-4 left-4 md:hidden z-50'/>
      {/*Main Content: Pass in layout for main content as child, 
      we do no layout styling here other than w-full to force the
       main content to take up the rest of the screen, otherwise 
       a stupid ass wrapper takes up the screen*/}
      <main className='flex-1 min-w-0 px-4'>
        <Outlet />
        <Toaster />
      </main>
    </SidebarProvider>
    
  )
}

export default DashboardLayout