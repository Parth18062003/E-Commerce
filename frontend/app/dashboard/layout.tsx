import { RetractingSidebar } from "@/components/RetractingSidebar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <RetractingSidebar />
      <div className="lg:translate-x-40 max-w-7xl">{children}</div>
    </>
  );
};

export default layout;
