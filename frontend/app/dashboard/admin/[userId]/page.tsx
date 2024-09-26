"use client";

import { logout } from "@/store/authSlice";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const page = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const reduxUser = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/authentication/sign-in");
  };


  if (!reduxUser) {
    return <p>User not found. Please log in again.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg- rounded-lg shadow-md">
    <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
    <div className="mt-4">
      <h2 className="text-xl font-semibold text-gray-700">Admin Profile</h2>
      <div className="mt-4 space-y-2">
        <p>
          <strong>Email:</strong> {reduxUser.email}
        </p>
        <p>
          <strong>First Name:</strong> {reduxUser.firstName}
        </p>
        <p>
          <strong>Last Name:</strong> {reduxUser.lastName}
        </p>
        <p>
          <strong>Address:</strong> {reduxUser.address}
        </p>
        <p>
          <strong>Phone Number:</strong> {reduxUser.phoneNumber}
        </p>
        <p>
          <strong>City:</strong> {reduxUser.city}
        </p>
        <p>
          <strong>State:</strong> {reduxUser.state}
        </p>
        <p>
          <strong>Postal Code:</strong> {reduxUser.postalCode}
        </p>
        <p>
          <strong>Roles:</strong>{" "}
          {reduxUser.roles.map((role) => role.name).join(", ")}
        </p>
      </div>
      <button
        onClick={handleLogout}
        className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Log Out
      </button>
    </div>
  </div>
  );
};

export default page;
