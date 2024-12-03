import { FAQ } from "@/components/faq/faq";
import { Footer } from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata ={
  title: "HH FAQ's",
  description: 'Frequently asked questions',
}

const FaqPage = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen py-16 px-4 text-zinc-800">
        <FAQ />
      </main>
      <Footer />
    </>
  );
};

export default FaqPage;
