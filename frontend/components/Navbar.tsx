"use client";

import { use, useEffect, useState } from "react";
import Logo from "./utils/Logo";
import { DropdownTabs } from "./ui/dropdown/dropdown-tabs";
import {
  Heart,
  Mic,
  Search,
  ShoppingBag,
  UserRound,
  Menu,
  X,
} from "lucide-react";
import { TransitionLink } from "./utils/TransitionLink";
import { ThemeToggle } from "./ui/theme-toggle";
import { DropdownLinks } from "./ui/dropdown/dropdown-links";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { SearchBox } from "react-instantsearch";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const reduxUser = useSelector((state: RootState) => state.auth.user);
  const dashboardLink = `/dashboard/user/${reduxUser?.id}`;  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-zinc-50 dark:bg-zinc-950 text-white dark:text-black relative z-50">
      <div className="hidden md:flex bg-zinc-800 dark:bg-zinc-200 max-w-full px-5 justify-end space-x-3 text-base dark:text-black text-white">
        <TransitionLink href="/authentication/sign-up">Sign up</TransitionLink>
        <span>|</span>
        <TransitionLink href="/">Find a store</TransitionLink>
        <span>|</span>
        <TransitionLink href="/">Contact</TransitionLink>
      </div>
      <div className="max-w-9xl mx-auto flex items-center justify-between p-4">
        {/* Logo on the left */}
        <div className="flex items-center px-4">
          <TransitionLink
            href="/"
            className="text-2xl font-bold hover:text-indigo-400 transition"
          >
            <Logo />
            <span className="sr-only">Logo Hype House</span>
          </TransitionLink>
        </div>

        {/* Hamburger Menu Button */}
        <div className="lg:hidden">
          <ThemeToggle />
          <button
            onClick={toggleMenu}
            className="text-2xl ml-3 text-zinc-800 dark:text-zinc-400 focus:outline-none"
          >
            {isOpen ? <X /> : <Menu />}
            <span className="sr-only">Menu</span>
          </button>
        </div>

        {/* TransitionLinks in the middle */}
        <div className="hidden lg:flex space-x-6">
          <DropdownTabs />
          <DropdownLinks />
        </div>

        {/* Search Input and Icons on the right */}
        <div className="items-center hidden lg:flex space-x-4 px-4">
          <div className="relative">
            <div className="flex-grow max-w-xl">
              <SearchBox
                placeholder="Search products..."
                classNames={{
                  root: "w-full",
                  form: "w-full",
                  input:
                    "pl-10 pr-10 py-2 rounded-full border border-zinc-500 bg-zinc-200 text-black dark:bg-zinc-700 dark:text-white focus:outline-none focus:ring-2 transition caret-indigo-400",
                  submit: "hidden",
                  reset: "hidden",
                }}
              />
              <div className="absolute inset-y-0 left-3 flex items-center text-zinc-400">
                <Search />
                <span className="sr-only">Search</span>
              </div>
              <div className="absolute inset-y-0 right-3 flex items-center text-zinc-600 dark:text-zinc-400 cursor-pointer">
                <Mic />
                <span className="sr-only">Voice input</span>
              </div>
            </div>
          </div>
          <ThemeToggle />
          <TransitionLink
            href="/login"
            className="text-zinc-600 dark:text-zinc-400 hover:text-indigo-400 transition"
          >
            <Heart />
            <span className="sr-only">Liked items</span>
          </TransitionLink>
          <TransitionLink
            href="/signup"
            className="text-zinc-600 dark:text-zinc-400 hover:text-indigo-400 transition"
          >
            <ShoppingBag />
            <span className="sr-only">Cart</span>
          </TransitionLink>
          <TransitionLink
            href={dashboardLink}
            className="text-zinc-600 dark:text-zinc-400 hover:text-indigo-400 transition"
          >
            <UserRound />
            <span className="sr-only">Profile</span>
          </TransitionLink>
        </div>
      </div>
      <div className="h-[2px] bg-zinc-300 dark:bg-zinc-700 mx-10" />

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className={`fixed top-0 right-0 w-full h-full bg-zinc-900 bg-opacity-90 z-50 flex flex-col p-4 transition-opacity duration-300 ${
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Backdrop blur effect */}
          <div
            className={`absolute inset-0 backdrop-blur-md transition-opacity duration-300 ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          ></div>
          <button
            onClick={toggleMenu}
            className="text-zinc-400 text-2xl self-end mb-4 z-10"
          >
            <X />
            <span className="sr-only">Close Menu</span>
          </button>
          <div className="flex flex-col space-y-4 text-white z-10">
            <TransitionLink href="/authentication/sign-up" onClick={toggleMenu}>
              Sign up
            </TransitionLink>
            <TransitionLink href="/" onClick={toggleMenu}>
              Find a store
            </TransitionLink>
            <TransitionLink href="/" onClick={toggleMenu}>
              Contact
            </TransitionLink>
            <TransitionLink href="/login" onClick={toggleMenu}>
              Login
            </TransitionLink>
            <TransitionLink href="/signup" onClick={toggleMenu}>
              Signup
            </TransitionLink>
            <TransitionLink href="/cart" onClick={toggleMenu}>
              Cart
            </TransitionLink>
            {/* Add more links as needed */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
