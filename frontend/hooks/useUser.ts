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

const useUser = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const reduxUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const isBrowser = () => typeof window !== "undefined";

    const loadUserFromLocalStorage = () => {
      if (isBrowser()) {
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

      const token = Cookies.get("token"); 

      try {
        const response = await axios.get(
          `http://localhost:8081/api/v1/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        
    console.log("reduxUser", response.data);
        dispatch(setUser(response.data)); // Set user in Redux
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

    if (!reduxUser && isBrowser()) {
      // Check if user is stored in local storage first
      loadUserFromLocalStorage();
    }

    if (!reduxUser) {
      fetchUser();
    } else {
      setLoading(false); // User is already in Redux store
    }
  }, [dispatch, pathname]); // Depend on pathname for URL changes

  return { user: reduxUser, loading, error }; // Return reduxUser directly
};

export default useUser;
