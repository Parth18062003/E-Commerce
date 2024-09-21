import React from "react";
import { TransitionLink } from "./utils/TransitionLink";

export const Footer = () => {
  return (
    <footer className="bg-zinc-50 dark:bg-zinc-950 dark:text-white text-black py-4">
      <div className="h-[2px] bg-zinc-300 dark:bg-zinc-700 mx-10 -translate-y-3" />
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="space-x-4 mb-2">
          <TransitionLink
            href="/privacy-policy"
            className="hover:text-blue-400 transition"
          >
            Privacy Policy
          </TransitionLink>
          <span>|</span>
          <TransitionLink
            href="/terms"
            className="hover:text-blue-400 transition"
          >
            Terms and Conditions
          </TransitionLink>
          <span>|</span>
          <TransitionLink
            href="/cookies"
            className="hover:text-blue-400 transition"
          >
            Cookies
          </TransitionLink>
        </div>
        <p className="text-sm text-gray-400">
          ©2024 Hype House India Marketing Pvt. Ltd
        </p>
      </div>
    </footer>
  );
};
