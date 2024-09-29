import { RetractingSidebar } from "@/components/RetractingSidebar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <RetractingSidebar />
      {children}
    </>
  );
};

export default layout;
