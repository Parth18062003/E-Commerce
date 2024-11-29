"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { studentOffers } from "@/components/student-offers/data/offers";
import { useVerification } from "@/hooks/useVerification";
import { VerificationForm } from "./verification-form";
import { OffersGrid } from "./offers-grid";

export default function StudentOffers() {
  const { status } = useVerification();

  return (
    <TooltipProvider>
      <main className="min-h-screen py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-zinc-800">Student Offers</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Exclusive discounts and deals for verified students. Save big on your favorite brands.
            </p>
          </div>

          <div className="mb-12">
            <VerificationForm />
          </div>

          <OffersGrid
            offers={studentOffers}
            isVerified={status.isVerified}
          />
        </div>
      </main>
    </TooltipProvider>
  );
}