import SendPasswordResetMail from "@/components/SendPasswordResetMail";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "HH - Forgot Password",
  description: "Forgot your password",
};

const PasswordResetMail = () => {
  return <SendPasswordResetMail />;
};

export default PasswordResetMail;
