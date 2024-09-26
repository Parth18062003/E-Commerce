"use client";

import { Footer } from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { HorizontalScrollCarousel } from "@/components/ScrollCarousel";
import HeroBackground from "@/components/ui/custom-grid";
import HeroText from "@/components/ui/hero-text";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const reduxUser = useSelector((state: RootState) => state.auth.user);
  return (
    <>
      <Navbar />
      <div className="text-white text-3xl"> welcome {reduxUser?.firstName}</div>
      <div className="bg-zinc-50 dark:bg-zinc-950 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="">
          <HeroBackground />
          <div className="flex items-end justify-start min-h-screen -translate-y-1/4 -translate-x-10">
            <HeroText />
          </div>
          <HorizontalScrollCarousel />
        </main>
      </div>
      <Footer />
    </>
  );
}
