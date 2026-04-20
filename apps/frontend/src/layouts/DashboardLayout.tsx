import React from 'react'
import AppSideBar from '@/components/AppSideBar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Outlet } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner"
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import useBreadCrumbs from"@/hooks/useBreadCrumbs"
import { useNavigate } from 'react-router-dom'

interface props {

}

function DashboardLayout({}: props) {
  const crumbs = useBreadCrumbs();
  const navigate = useNavigate();
  console.log("crumbs:",crumbs);
  return (
    // <SidebarProvider>
    //   <AppSideBar/>

    //   <SidebarTrigger className='absolute top-4 left-4 md:hidden z-50'/>
    //   {/*Main Content: Pass in layout for main content as child, 
    //   we do no layout styling here other than w-full to force the
    //    main content to take up the rest of the screen, otherwise 
    //    a stupid ass wrapper takes up the screen*/}
    //    {/* Used to be w-full */}
    //   <main className='flex-1 min-w-0 px-4'> 
    //     <Outlet />
    //     <Toaster />
    //   </main>
    // </SidebarProvider>
    <SidebarProvider>
      <AppSideBar />
      <div className='flex flex-col min-w-0 w-full'>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
            <BreadcrumbList>
              {crumbs.map((crumb,i) => 
                {
                return <React.Fragment key={i}>
                <BreadcrumbItem>
                  <BreadcrumbLink className={crumbs.length-1 == i ? 'font-bold' : 'hover:cursor-pointer'} onClick={async () => await navigate("/" + crumbs.slice(0,i+1).join("/"))}>{crumb}</BreadcrumbLink>
                </BreadcrumbItem>
                {(i != crumbs.length-1) &&<BreadcrumbSeparator />}
                </React.Fragment>
                }
              )}
            </BreadcrumbList>
          </Breadcrumb>
          </div>
        </header>
        <main className="flex-1 min-w-0 px-4">
          <Outlet></Outlet>
          <Toaster />
        </main>
      </div>
    </SidebarProvider>
  )
}

export default DashboardLayout