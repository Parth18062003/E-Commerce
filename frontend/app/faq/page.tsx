import { FAQ } from "@/components/faq/faq";
import { Footer } from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";

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
