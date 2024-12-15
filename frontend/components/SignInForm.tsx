"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { TransitionLink } from "./utils/TransitionLink";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { login } from "@/store/authSlice";
import { toast } from "sonner";

type SignInFormData = z.infer<typeof SignInSchema>;

export function SignInForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();

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
  
    console.log("Submitting login form with:", data);
  
    try {
      const response = await axios.post(
        "http://192.168.29.159:8081/api/v1/auth/login",
        {
          username: data.email,
          password: data.password,
        }
      );
  
      console.log("API response:", response.data);
  
      if (response.data["2FARequired"]) {
        // Redirect to the 2FA page if required
        toast.info("2fa code has been sent. Please check your email.");
        setLoading(true);
        router.push(`/authentication/2fa?email=${encodeURIComponent(data.email)}`);
      } else if (response.data.token) {
        // Set the token in cookies
        Cookies.set("token", response.data.token, { expires: 7, path: '/' });
        dispatch(login({ token: response.data.token })); // Dispatch the login action
        // Dispatch the login action
  
        toast("Login successful!");
        console.log("User ID:", response.data.userId);
        router.push(`/dashboard/user/${response.data.userId}`);
      } else {
        const message = response.data.message || "An unknown error occurred.";
        toast.error(message);
        setApiError(message);
      }
  
      reset(); // Reset the form at the end of the try block
    } catch (error: any) {
      console.error("Error during login:", error);
      
      // Improved error handling
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data?.message || "An error occurred while logging in.";
        toast.error(errorMessage);
        setApiError(errorMessage);
      } else {
        toast.error("An unexpected error occurred. Please try again.", error);
        setApiError("An unexpected error occurred.");
      }
    } finally {
      reset();
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      window.location.href = "http://192.168.29.159:8081/oauth2/authorization/google";
    } catch (error: any) {
      console.error("Error during Google login:", error);
      toast("An error occurred while logging in with Google. Please try again.", error);
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-zinc-100 dark:bg-zinc-900">
      {/* Login Form Column */}
      <div className="flex flex-col justify-center translate-y-20 md:translate-y-0 lg:w-1/2 p-4 lg:p-8">
        <div className="absolute bottom-auto -z-10 left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-zinc-800 dark:bg-zinc-600 opacity-50 blur-[80px]"></div>
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
                    placeholder={showPassword ? "password" : "●●●●●●"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                    <span className="sr-only">View Password</span>
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <TransitionLink
                href="/authentication/forgot-password"
                className="text-sm dark:text-zinc-300 text-zinc-700 hover:underline"
              >
                Reset Password
              </TransitionLink>
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
              <Button variant="outline" className="w-full mt-2" onClick={handleGoogleLogin}> 
                Login with Google
                <svg
                  xmlns="http://www.w3.org/2000/svg"
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
                Don&apos;t have an account?{" "}
                <TransitionLink
                  href="/authentication/sign-up"
                  className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-left after:scale-x-100 after:bg-zinc-800 after:transition-transform after:duration-150 after:ease-in-out hover:after:origin-bottom-right hover:after:scale-x-0"
                >
                  Sign up
                </TransitionLink>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      {/* Cover Image Column */}
      <div className="relative lg:w-1/2 flex justify-center items-center">
        <ImageContainer imageUrl="https://static.nike.com/a/images/f_auto/dpr_1.3,cs_srgb/h_700,c_limit/56e7677b-c5b6-4b84-9f09-5db7740fb885/image.png" />
      </div>

    </div>
  );
}
