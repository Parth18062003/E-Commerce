import { Footer } from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full flex">
        <main className="flex flex-col w-full">
          <div className="flex-grow">{children}</div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
