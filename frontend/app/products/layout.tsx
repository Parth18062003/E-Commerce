import { Footer } from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="grow w-full">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
