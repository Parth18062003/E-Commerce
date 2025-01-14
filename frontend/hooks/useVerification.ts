"use client";

import { universities } from "@/components/student-offers/data/universities";
import { VerificationStatus } from "@/components/student-offers/types";
import { useState, useEffect } from "react";

export function useVerification() {
  const [status, setStatus] = useState<VerificationStatus>({
    isVerified: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load verification status from localStorage on initial render
  useEffect(() => {
    const savedStatus = localStorage.getItem("verificationStatus");
    if (savedStatus) {
      setStatus(JSON.parse(savedStatus));
    }
  }, []);

  const verifyEmail = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      const domain = email.split("@")[1];
      const university = universities.find((u) =>
        u.domains.includes(domain)
      );

      if (!university) {
        throw new Error("Email domain not recognized");
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update status with all necessary fields
      const newStatus = {
        isVerified: true,
        university,
        email,
        expiryDate: new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000
        ).toISOString(),
      };

      // Save to localStorage
      localStorage.setItem("verificationStatus", JSON.stringify(newStatus));
      setStatus(newStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
      setStatus({ isVerified: false });
    } finally {
      setLoading(false);
    }
  };

  return { status, loading, error, verifyEmail };
}