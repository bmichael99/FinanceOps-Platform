import { Calendar, Home, Inbox, Search, Settings, FileUp, ShieldCheck, SquarePlus, ChartNoAxesCombined, FileText } from "lucide-react"
 import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../components/ui/sidebar"
 
// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

const invoiceItems = [
  {
    title: "Upload",
    url: "/dashboard/invoices/upload",
    icon: FileUp,
  },
  {
    title: "Verify",
    url: "/dashboard/invoices/verify",
    icon: ShieldCheck,
  },
  {
    title: "Browse",
    url: "/dashboard/invoices/browse",
    icon: Search,
  },
  {
    title: "Create",
    url: "/dashboard/invoices/create",
    icon: SquarePlus,
  },
]

const analyticItems = [
  {
    title: "Insights",
    url: "#",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Reports",
    url: "#",
    icon: FileText,
  },
]
 
function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarContent>
        {/*Application*/}
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/*Invoices*/}
        <SidebarGroup>
          <SidebarGroupLabel>Invoices</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {invoiceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/*Analytics*/}
        <SidebarGroup>
          <SidebarGroupLabel>Analytics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analyticItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar