import { Footer } from "@/components/Footer";
import Navbar from "@/components/Navbar";
import StudentOffers from "@/components/student-offers/student-offers";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata ={
  title: 'HH Student Offers',
  description: 'Exclusive offers for students',
}

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
