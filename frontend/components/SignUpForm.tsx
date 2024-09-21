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
import { Eye, EyeOff, Image } from "lucide-react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import Notification from "./ui/notification";
import { TransitionLink } from "./utils/TransitionLink";

type SignUpFormData = z.infer<typeof signUpSchema>;
type NotificationType = {
  id: number;
  text: string;
  type: "info" | "success" | "error";
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
    <div className="flex flex-col bg-zinc-900 lg:flex-row lg:min-h-screen">
      <div className="flex flex-col justify-center translate-y-6 md:translate-y-0 lg:w-1/2 p-4 lg:p-8"><div className="absolute bottom-auto -z-10 left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-zinc-600 opacity-50 blur-[80px]"></div>{/*bg-[rgba(173,109,244,0.5)]*/}
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
                    placeholder={showPassword ? "password" : "●●●●●●"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                    {<div className="sr-only">View Password</div>}
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
                Sign up with Google{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="20"
                  height="20"
                  viewBox="0 0 48 48"
                  className="ml-1"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  ></path>
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  ></path>
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                </svg>
              </Button>
              <div className="mt-4 text-center text-sm text-gray-700">
                Already have an account?{" "}
                <TransitionLink
                  href="/authentication/sign-in"
                  className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-left after:scale-x-100 after:bg-zinc-800 after:transition-transform after:duration-150 after:ease-in-out hover:after:origin-bottom-right hover:after:scale-x-0"
                >
                  Sign in
                </TransitionLink>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <div className="relative lg:w-1/2">
        <ImageContainer imageUrl="https://static.nike.com/a/images/w_480,c_limit,f_auto,q_auto/b4841c0f-9f30-49a1-8f21-48f77e2052c4/what-you-got-sndr-edition-x-linus.jpg" />
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
