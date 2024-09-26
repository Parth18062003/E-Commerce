"use client";

import useUser from "@/hooks/useUser";
import { logout } from "@/store/authSlice";
import { RootState } from "@/store/store";
import {
  Globe,
  House,
  Mail,
  MapPin,
  Phone,
  Signpost,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const UserInfo = () => {
  const { loading, error } = useUser();
  const dispatch = useDispatch();
  const router = useRouter();
  const reduxUser = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/authentication/sign-in");
  };

  if (loading) {
    return <p>Loading user data...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!reduxUser) {
    return <p>User not found. Please log in again.</p>;
  }
  return (
    <>
      <div className="max-w-2xl mx-auto p-6 bg-zinc-200 dark:bg-zinc-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-200 text-center">
          User Dashboard
        </h1>
        <div className="mt-8 flex flex-col items-center">
          <h2 className="text-2xl font-semibold text-zinc-700 dark:text-zinc-300">
            User Profile
          </h2>
        </div>

        <div className="mt-4 space-y-4 p-6 bg-zinc-300 dark:bg-zinc-600 rounded-lg shadow-inner">
          {[
            {
              icon: <Mail className="text-zinc-100" />,
              label: "Email",
              value: reduxUser.email,
            },
            {
              icon: <UserRound className="text-zinc-100" />,
              label: "First Name",
              value: reduxUser.firstName,
            },
            {
              icon: <UserRound className="text-zinc-100" />,
              label: "Last Name",
              value: reduxUser.lastName,
            },
            {
              icon: <Phone className="text-zinc-100" />,
              label: "Phone Number",
              value: reduxUser.phoneNumber,
            },
            {
              icon: <House className="text-zinc-100" />,
              label: "Address",
              value: reduxUser.address,
            },
            {
              icon: <MapPin className="text-zinc-100" />,
              label: "City",
              value: reduxUser.city,
            },
            {
              icon: <Globe className="text-zinc-100" />,
              label: "State",
              value: reduxUser.state,
            },
            {
              icon: <Signpost className="text-zinc-100" />,
              label: "Postal Code",
              value: reduxUser.postalCode,
            },
            {
              icon: <UsersRound className="text-zinc-100" />,
              label: "Roles",
              value: reduxUser.roles.map((role) => role.name).join(", "),
            },
          ].map(({ icon, label, value }) => (
            <div className="flex items-center" key={label}>
              {icon}
              <p className="ml-2 text-zinc-800 dark:text-zinc-200">
                <strong>{label}:</strong> {value}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 w-full py-3 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition duration-200 shadow-md"
        >
          Log Out
        </button>
      </div>
    </>
  );
};

export default UserInfo;
