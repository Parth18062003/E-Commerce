"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, Facebook, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InstagramLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import { TransitionLink } from "./utils/TransitionLink";

const links = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Store Locator", href: "/stores" },
    { label: "Sustainability", href: "/sustainability" },
  ],
  help: [
    { label: "Order Status", href: "/orders" },
    { label: "Shipping & Delivery", href: "/shipping" },
    { label: "Returns", href: "/returns" },
    { label: "Size Guide", href: "/products/size-guide" },
  ],
  resources: [
    { label: "FAQ", href: "/faq" },
    { label: "Blog", href: "/blog" },
    { label: "Community", href: "/community" },
    { label: "Student Offers", href: "/student-offers" },
  ],
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function CTASection() {
  return (
    <section className="bg-primary/5 relative">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
        >
          {/* Newsletter Signup */}
          <motion.div variants={item} className="space-y-4">
            <h3 className="text-xl font-bold text-zinc-700">
              Join Our Newsletter
            </h3>
            <p className="text-muted-foreground">
              Sign up for exclusive offers, original stories, events and more.
            </p>
            <Button className="w-full group">
              Sign Up
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <div className="flex space-x-4 pt-4">
              <Link
                href="https://www.facebook.com/"
                target="_blank"
                className="text-muted-foreground hover:text-indigo-400 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.twitter.com/"
                target="_blank"
                className="text-muted-foreground hover:text-indigo-400 transition-colors"
              >
                <TwitterLogoIcon className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.instagram.com/"
                target="_blank"
                className="text-muted-foreground hover:text-indigo-400 transition-colors"
              >
                <InstagramLogoIcon className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.youtube.com/"
                target="_blank"
                className="text-muted-foreground hover:text-indigo-400 transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>

          {/* Link Sections */}
          {Object.entries(links).map(([title, items]) => (
            <motion.div key={title} variants={item} className="space-y-4">
              <h3 className="text-xl font-bold capitalize text-zinc-700">
                {title}
              </h3>
              <ul className="space-y-3">
                {items.map((link) => (
                  <li key={link.href}>
                    <TransitionLink
                      href={link.href}
                      className="text-muted-foreground hover:text-indigo-400 transition-colors"
                    >
                      {link.label}
                    </TransitionLink>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
