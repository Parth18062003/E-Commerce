"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import ImageContainer from "./ShaderCanvas";
import { SignInSchema } from "@/schema/schema";
import { useRouter } from "next/navigation";
import Notification from "./ui/notification";

// Define form data type based on schema
type SignInFormData = z.infer<typeof SignInSchema>;
type NotificationType = {
  id: number;
  text: string;
  type: "info" | "success" | "error";
};

export function SignInForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignInFormData>({
    resolver: zodResolver(SignInSchema),
  });

  // Handle form submission
  const onSubmit: SubmitHandler<SignInFormData> = async (data) => {
    setLoading(true);
    setApiError(null);

    try {
      const response = await axios.post(
        "http://localhost:8081/api/v1/auth/login",
        {
          username: data.email,
          password: data.password,
        }
      );
      
      localStorage.removeItem("token");
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        addNotification("Login successful!", "success");
        router.push(`/dashboard/user/${response.data.userId}`);
      } else {
        addNotification(
          response.data.message || "An unkown error occurred",
          "error"
        );
        setApiError(response.data.message || "An unknown error occurred.");
      }

      reset();
    } catch (error: any) {
      if (error.response && error.response.data) {
        addNotification(
          error.response.data.message || "An error occurred while logging in.",
          "error"
        );
        setApiError(
          error.response.data.message || "An error occurred while logging in."
        );
      } else {
        setApiError("An error occurred while logging in.");
      }
    } finally {
      setLoading(false);
    }
  };

  const addNotification = (
    text: string,
    type: "info" | "success" | "error"
  ) => {
    setNotifications((prev) => [{ id: Math.random(), text, type }, ...prev]);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  return (
    <div className="flex flex-col lg:flex-row lg:min-h-screen">
      {/* Login Form Column */}
      <div className="flex flex-col justify-center lg:w-1/2 p-4 lg:p-8">
        <Card className="mx-auto max-w-md w-full shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="relative space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"} // Toggle input type
                    {...register("password")}
                    className={`pr-12 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    placeholder="●●●●●●"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}{" "}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {apiError && <p className="text-red-500 text-sm">{apiError}</p>}

              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? (
                  <div className="flex items-center">
                    <span>Loading... </span>
                    <div className="relative ml-2">
                      <div className="w-6 h-6 border-4 border-solid border-zinc-200 rounded-full absolute"></div>
                      <div className="w-6 h-6 border-4 border-solid border-zinc-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
              <Button variant="outline" className="w-full mt-2">
                Login with Google
              </Button>
              <div className="mt-4 text-center text-sm text-gray-700">
                Don&apos;t have an account?{" "}
                <Link
                  href="/authentication/sign-up"
                  className="font-semibold text-blue-600 underline"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      {/* Cover Image Column */}
      <div className="relative lg:w-1/2">
        <ImageContainer imageUrl="https://static.nike.com/a/images/f_auto/dpr_1.3,cs_srgb/h_700,c_limit/56e7677b-c5b6-4b84-9f09-5db7740fb885/image.png" />
      </div>

      {/* Notifications */}
      <div className="fixed top-2 right-2 z-50 pointer-events-none">
        {notifications.map((notif) => (
          <Notification
            key={notif.id}
            id={notif.id}
            text={notif.text}
            type={notif.type}
            removeNotif={removeNotification}
          />
        ))}
      </div>
    </div>
  );
}
