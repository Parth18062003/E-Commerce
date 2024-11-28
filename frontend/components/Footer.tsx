import React from "react";
import { TransitionLink } from "./utils/TransitionLink";

export const Footer = () => {
  return (
    <footer className="bg-primary/5 dark:bg-zinc-950 dark:text-white text-black py-4 relative bottom-0">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="flex flex-col sm:flex-row items-center justify-center space-x-0 sm:space-x-4 mb-2">
          <TransitionLink
            href="/privacy-policy"
            className="hover:text-indigo-400 transition mb-1 sm:mb-0"
          >
            Privacy Policy
          </TransitionLink>
          <span className="hidden sm:inline">|</span>
          <TransitionLink
            href="/terms"
            className="hover:text-indigo-400 transition mb-1 sm:mb-0"
          >
            Terms and Conditions
          </TransitionLink>
          <span className="hidden sm:inline">|</span>
          <TransitionLink
            href="/cookies"
            className="hover:text-indigo-400 transition mb-1 sm:mb-0"
          >
            Cookies
          </TransitionLink>
        </div>
        <p className="text-sm text-zinc-400 text-center">
          ©2024 Hype House India Marketing Pvt. Ltd
        </p>
      </div>
    </footer>
  );
};
