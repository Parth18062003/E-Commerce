import { Footer } from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full flex">
        <aside
          className="text-black min-h-screen w-1/5 hidden lg:block border-r border-red-500"
        >
          {/* Replace this with actual sidebar content */}
          <div className="p-4">
            <h2 className="font-bold">Filters</h2>

          </div>
        </aside>
        <main className="flex flex-col w-full">
          <div className="flex justify-end text-black mx-6 gap-12 mt-5">
            <div>Sort by</div>
            <div>Filters</div>
          </div>
          <div className="flex-grow">{children}</div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
