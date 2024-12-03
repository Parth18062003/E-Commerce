import TwoFAForm from "@/components/TwoFaForm";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "HH 2FA",
  description: "Enter your 2FA code",
};

const TwoFaPage = () => {
  return <TwoFAForm />;
};

export default TwoFaPage;
