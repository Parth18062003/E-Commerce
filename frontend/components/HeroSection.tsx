"use client";

import Image from "next/image";
import React from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { ArrowRight, Asterisk } from "lucide-react";
import { Alert, AlertBanner } from "./ui/banner";
import { Badge } from "./ui/badge";

const alerts: Alert[] = [
  {
    id: "1",
    type: "info",
    title: "New Collection Drop",
    message: "The Spring 2024 collection is now available.",
    link: {
      text: "Shop Now",
      url: "/collections/spring-2024",
    },
    expiresAt: new Date("2025-04-01"),
  },
  {
    id: "2",
    type: "info",
    title: "Exclusive Early Access",
    message:
      "Get early access to the latest Nike releases before anyone else. Sign up today!",
    link: {
      text: "Sign Up",
      url: "/early-access",
    },
    expiresAt: new Date("2025-03-01"),
  },
  {
    id: "3",
    type: "info",
    title: "Holiday Sale Now Live",
    message:
      "Our biggest sale of the year is here! Save up to 40% on select items.",
    link: {
      text: "Shop Holiday Sale",
      url: "/holiday-sale",
    },
    expiresAt: new Date("2025-12-31"),
  },
  {
    id: "4",
    type: "info",
    title: "New Loyalty Program Launch",
    message:
      "Earn points with every purchase and unlock exclusive rewards with our new loyalty program.",
    link: {
      text: "Learn More",
      url: "/loyalty-program",
    },
    expiresAt: new Date("2025-09-30"),
  },
];

const HeroSection = () => {
  return (
    <div className="relative">
      <AlertBanner alerts={alerts} />
      <section className="relative  h-[60vh] lg:h-screen w-full overflow-hidden">
        {/*         <Image
          src="https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/w_1824,c_limit/dcf1777b-7a1b-4b09-bc8f-0eb544085987/nike-just-do-it.png"
          alt="Hero Section Image"
          fill
          priority
          className="object-cover"
          sizes="80vw"
          quality={90}
        /> */}
        <Image
          src="https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/w_1824,c_limit/dcf1777b-7a1b-4b09-bc8f-0eb544085987/nike-just-do-it.png"
          alt="HypeHouse Hero Image"
          fill
          sizes="100vw"
          priority
          className="absolute object-cover object-left"
        />
        <div className="relative z-10 flex h-full items-center justify-center px-4">
          <div className="max-w-4xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl"
            >
              End of Season Sale.
            </motion.h1>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12 text-lg text-white/90 sm:text-xl md:text-2xl"
            >
              Save an extra 15%. Valid upto{" "}
              <Badge variant="outline" className="lg:text-xl">
                31st March
              </Badge>
            </motion.span>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button
                size="lg"
                className="group bg-white text-gray-900 hover:bg-white/90 mt-4"
              >
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-black/30"
          aria-hidden="true"
        />
      </section>
    </div>
  );
};

export default HeroSection;
