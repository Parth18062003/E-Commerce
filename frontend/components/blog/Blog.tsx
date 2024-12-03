"use client";

import { motion } from "motion/react";
import { BlogGrid } from "@/components/blog/blog-grid";
import { NewsletterForm } from "@/components/blog/newsletter-form";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Blog() {
  return (
    <>
    <Navbar />
    <main className="min-h-screen">
      {/* Newsletter Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold mb-4"
            >
              Stay in the Loop
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-primary-foreground/80 max-w-2xl mx-auto"
            >
              Subscribe to our newsletter for exclusive updates, early access to drops,
              and style inspiration delivered straight to your inbox.
            </motion.p>
          </div>
          <NewsletterForm />
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold mb-4 text-zinc-800" 
            > 
              Latest Stories
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground max-w-2xl mx-auto"
            >
              Discover the latest trends, styling tips, and stories from the world of
              streetwear and sneaker culture.
            </motion.p>
          </div>
          <BlogGrid />
        </div>
      </section>
    </main>
    <Footer />
    </>
  );
}