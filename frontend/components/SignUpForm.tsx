"use client";

import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import ImageContainer from "./ShaderCanvas";
import { signUpSchema } from "@/schema/schema";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import Notification from "./ui/notification";

type SignUpFormData = z.infer<typeof signUpSchema>;
type NotificationType = {
  id: number;
  text: string;
  type: 'info' | 'success' | 'error';
};

export function SignUpForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    setLoading(true);
    setApiError(null);

    const username =
      data.firstName + data.lastName + Math.floor(Math.random() * 1000);
    try {
      // Make API request
      const response = await axios.post(
        "http://localhost:8081/api/v1/users/register",
        {
          username: username,
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
        }
      );

      // Check if response contains a token or other expected data
      if (response.status === 201) {
        // Redirect to sign-in page
        addNotification("User created successfully!", "success");
        router.push(`/authentication/sign-in`);
      } else {
        // Handle unexpected status
        addNotification(
          response.data.message || "An unknown error occurred.",
          "error"
        );
        setApiError("An unexpected error occurred.");
      }

      // Clear form fields
      reset();
    } catch (error: any) {
      // Handle errors
      if (error.response && error.response.data) {
        addNotification(
          error.response.data.message || "An error occurred while registering.",
          "error"
        );
        setApiError(
          error.response.data.message || "An error occurred while registering."
        );
      } else {
        addNotification("An error occurred while registering.", "error");
        setApiError("An error occurred while registering.");
      }
    } finally {
      // Reset loading state
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
      <div className="flex flex-col justify-center lg:w-1/2 p-4 lg:p-8">
        <Card className="mx-auto max-w-md w-full shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    placeholder="Max"
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    placeholder="Robinson"
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="m@example.com"
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
                    type={showPassword ? "text" : "password"}
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
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full mt-4">
                {loading ? (
                  <div className="flex items-center">
                    <span>Creating an account... </span>
                    <div className="relative ml-2">
                      <div className="w-6 h-6 border-4 border-solid border-zinc-200 rounded-full absolute"></div>
                      <div className="w-6 h-6 border-4 border-solid border-zinc-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                ) : (
                  "Create an account"
                )}
              </Button>
              <Button variant="outline" className="w-full mt-2">
                Sign up with GitHub
              </Button>
              <div className="mt-4 text-center text-sm text-gray-700">
                Already have an account?{" "}
                <Link
                  href="/authentication/sign-in"
                  className="font-semibold text-blue-600 underline"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
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
