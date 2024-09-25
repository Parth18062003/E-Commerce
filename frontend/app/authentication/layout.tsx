import { TransitionLink } from "@/components/utils/TransitionLink";
import { Home } from "lucide-react";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {" "}
      <div className="flex flex-col min-h-screen">
        <header className="flex items-center absolute p-8 bg-zinc-100 dark:bg-zinc-900 z-10">
          <TransitionLink href="/" className="text-zinc-700 dark:text-zinc-200">
            <Home /> <span className="sr-only">Home</span>
          </TransitionLink>
        </header>
        <main className="flex-grow">{children}</main>
      </div>
    </>
  );
};

export default layout;
