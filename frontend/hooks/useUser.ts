"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/authSlice";
import { RootState } from "@/store/store";
import Cookies from "js-cookie";

interface Role {
  id: string;
  name: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  roles: Role[];
  city: string;
  state: string;
  country: string;
  postalCode: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  is2FAEnabled: boolean;
}

const useUser = async () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const reduxUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    // Check if window is available
    const isBrowser = typeof window !== "undefined";

    const loadUserFromLocalStorage = () => {
      if (isBrowser) {
        const storedUser = localStorage.getItem("userData");
        if (storedUser) {
          dispatch(setUser(JSON.parse(storedUser)));
        }
      }
    };

    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      const userId = pathname.split("/").pop(); 
      if (!userId) {
        setError("User ID not found in the URL.");
        setLoading(false);
        return;
      }

      const token = Cookies.get("token"); // Get token from cookies
      if (!token) {
        setError("Authentication token is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://192.168.29.152:8081/api/v1/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Store user data in Redux
        dispatch(setUser(response.data));
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || "Failed to fetch user data.");
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    // Ensure data is loaded from localStorage or API
    if (!reduxUser) {
      loadUserFromLocalStorage(); // Try loading user from local storage first
      fetchUser(); // Fetch from API if user is not available
    } else {
      setLoading(false); // If the user is already in Redux, no need to fetch
    }
  }, [dispatch, pathname, reduxUser]); // `reduxUser` added to ensure no unnecessary calls

  return { user: reduxUser, loading, error };
};

export default useUser;
