"use client";

import Logo from "./utils/Logo";
import { DropdownTabs } from "./ui/dropdown-tabs";
import { Heart, Mic, Search, ShoppingBag, UserRound } from "lucide-react";
import { TransitionLink } from "./utils/TransitionLink";
import { ThemeToggle } from "./ui/theme-toggle";

const Navbar = () => {
  return (
    <nav className="bg-zinc-50 dark:bg-zinc-950 text-white dark:text-black shadow-md">
      <div className="hidden md:flex bg-zinc-800 dark:bg-zinc-200 max-w-full px-5 justify-end space-x-3 text-base dark:text-black text-white">
        <TransitionLink href="/authentication/sign-up">Sign up</TransitionLink>
        <span>|</span>
        <TransitionLink href="/">Find a store</TransitionLink>
        <span>|</span>
        <TransitionLink href="/">Contact</TransitionLink>
      </div>
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        {/* Logo on the left */}
        <div className="flex items-center">
          <TransitionLink
            href="/"
            className="text-2xl font-bold hover:text-blue-400 transition"
          >
            <Logo />
          </TransitionLink>
        </div>

        {/* TransitionLinks in the middle */}
        <div className="hidden md:flex space-x-6">
          <DropdownTabs />
        </div>

        {/* Search Input and Icons on the right */}
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:flex">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-10 py-2 rounded-full border border-zinc-500 bg-zinc-200 text-black dark:bg-zinc-700 dark:text-white focus:outline-none focus:ring-2 transition"
            />
            <div className="absolute inset-y-0 left-3 flex items-center text-zinc-400">
              <Search />
            </div>
            <div className="absolute inset-y-0 right-3 flex items-center text-zinc-600 dark:text-zinc-400cursor-pointer">
              <Mic />
            </div>
          </div>
          <ThemeToggle />
          <TransitionLink
            href="/login"
            className="text-zinc-600 dark:text-zinc-400 hover:text-blue-400 transition"
          >
            <Heart />
          </TransitionLink>
          <TransitionLink
            href="/signup"
            className="text-zinc-600 dark:text-zinc-400 hover:text-blue-400 transition"
          >
            <ShoppingBag />
          </TransitionLink>
          <TransitionLink
            href="/cart"
            className="text-zinc-600 dark:text-zinc-400 hover:text-blue-400 transition"
          >
            <UserRound />
          </TransitionLink>
        </div>
      </div>
      <div className="h-[2px] bg-zinc-300 dark:bg-zinc-700 mx-10" />
    </nav>
  );
};

export default Navbar;
