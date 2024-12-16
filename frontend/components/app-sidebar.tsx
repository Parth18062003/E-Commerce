"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  ShoppingCart, Box, Package, User, CreditCard, Settings, Tag, Home, Truck
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { NavProjects } from "./nav-projects"

// This is sample data.
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],

  navMain : [
    {
      title: "Dashboard",
      url: "#",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "#",
        },
        {
          title: "Sales Analytics",
          url: "#",
        },
        {
          title: "Inventory",
          url: "/dashboard/admin/inventory",
        },
      ],
    },
    {
      title: "Orders",
      url: "#",
      icon: ShoppingCart,
      items: [
        {
          title: "All Orders",
          url: "#",
        },
        {
          title: "Pending Orders",
          url: "#",
        },
        {
          title: "Completed Orders",
          url: "#",
        },
        {
          title: "Returns & Refunds",
          url: "#",
        },
      ],
    },
    {
      title: "Products",
      url: "#",
      icon: Box,
      items: [
        {
          title: "All Products",
          url: "/dashboard/admin/product",
        },
        {
          title: "Add New Product",
          url: "/dashboard/admin/product/create-product",
        },
        {
          title: "Categories",
          url: "#",
        },
        {
          title: "Reviews",
          url: "#",
        },
      ],
    },
    {
      title: "Customers",
      url: "#",
      icon: User,
      items: [
        {
          title: "All Customers",
          url: "/dashboard/admin/users",
        },
        {
          title: "Customer Groups",
          url: "#",
        },
        {
          title: "Support Tickets",
          url: "#",
        },
      ],
    },
    {
      title: "Payments",
      url: "#",
      icon: CreditCard,
      items: [
        {
          title: "Payment Methods",
          url: "#",
        },
        {
          title: "Transaction History",
          url: "#",
        },
        {
          title: "Refunds",
          url: "#",
        },
      ],
    },
    {
      title: "Shipping",
      url: "#",
      icon: Truck,
      items: [
        {
          title: "Shipping Methods",
          url: "#",
        },
        {
          title: "Tracking",
          url: "#",
        },
        {
          title: "Shipping History",
          url: "#",
        },
      ],
    },
    {
      title: "Discounts & Coupons",
      url: "#",
      icon: Tag,
      items: [
        {
          title: "All Coupons",
          url: "#",
        },
        {
          title: "Add New Coupon",
          url: "#",
        },
        {
          title: "Discounts",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Payment Settings",
          url: "#",
        },
        {
          title: "Shipping Settings",
          url: "#",
        },
        {
          title: "Store Preferences",
          url: "#",
        },
      ],
    },
  ],  
  projects: [
    {
      name: "Home",
      url: "/",
      icon: Home,
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const reduxUser = useSelector((state: RootState) => state.auth.user);

  const user = {
    email: reduxUser?.email || "",
    name: reduxUser?.firstName + " " + reduxUser?.lastName || "",
    avatar: reduxUser?.profileImageUrl || "",
  }
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
