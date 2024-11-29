import { Footer } from "@/components/Footer";
import Navbar from "@/components/Navbar";
import StudentOffers from "@/components/student-offers/student-offers";
import React from "react";

const StudentOffersPage = () => {
  return (
    <>
      <Navbar />
      <StudentOffers />
      <Footer />
    </>
  );
};

export default StudentOffersPage;
