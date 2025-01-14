import Cart from "@/components/Cart/Cart";
import { CTASection } from "@/components/CtaSection";
import { Footer } from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata ={
  title: "HH Cart",
  description: 'Manage your cart items',
}

const CartPage = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Main Content Section */}
          <main className="p-6">
            
          <h2 className="text-black text-4xl font-semibold">Cart Items</h2>
            <Cart />
          </main>
        </div>
      </div>
      <CTASection />
      <Footer />
    </>
  );
};

export default CartPage;
