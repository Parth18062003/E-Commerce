import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SidebarTrigger
            className="text-black m-2"
          />
          <div className="relative">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default layout;
