"use client";

import Logo from "./utils/Logo";
import { DropdownTabs } from "./ui/dropdown-tabs";
import { Heart, Mic, Search, ShoppingBag, UserRound } from "lucide-react";
import { TransitionLink } from "./utils/TransitionLink";

const Navbar = () => {
  return (
    <nav className="bg-transparent text-white shadow-md">
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
              className="pl-10 pr-10 py-2 rounded-full border border-zinc-500 bg-zinc-700 text-white focus:outline-none focus:ring-2 transition"
            />
            <div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <Search />
            </div>
            <div className="absolute inset-y-0 right-3 flex items-center text-gray-400 cursor-pointer">
              <Mic />
            </div>
          </div>
          <TransitionLink href="/login" className="text-gray-400 hover:text-blue-400 transition">
            <Heart />
          </TransitionLink>
          <TransitionLink href="/signup" className="text-gray-400 hover:text-blue-400 transition">
            <ShoppingBag />
          </TransitionLink>
          <TransitionLink href="/cart" className="text-gray-400 hover:text-blue-400 transition"><UserRound /></TransitionLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
