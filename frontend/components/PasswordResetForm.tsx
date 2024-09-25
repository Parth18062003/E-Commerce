"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { PasswordResetSchema } from "@/schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";

type PasswordResetData = z.infer<typeof PasswordResetSchema>;

export default function PasswordResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("token"); // Assuming the reset token is passed as a query parameter
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordResetData>({
    resolver: zodResolver(PasswordResetSchema),
  });

  const onSubmit: SubmitHandler<PasswordResetData> = async (data) => {
    setLoading(true);
    setApiError(null);

    if (!resetToken) {
      setApiError("Reset token is not defined.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8081/api/v1/auth/reset-password/${resetToken}`,
        {
          newPassword: data.password,
        }
      );

      // Redirect to sign-in page after successful reset
      router.push(`/authentication/sign-in`);
      reset();
    } catch (error: any) {
      setApiError(error.response?.data.message || "Error resetting password.");
      reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-zinc-100 dark:bg-zinc-900">
      <div className="flex flex-col justify-center lg:w-1/2 p-4 lg:p-8 relative">
        <div className="absolute bottom-auto z-0 top-0 h-[500px] w-[500px] -translate-x-[20%] translate-y-[10%] rounded-full bg-zinc-400 dark:bg-zinc-700 opacity-50 blur-[80px]"></div>
        <Card className="mx-auto max-w-md w-full shadow-xl rounded-lg p-6 bg-white dark:bg-zinc-800 z-10">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-zinc-800 dark:text-zinc-200">
              Reset Password
            </CardTitle>
            <CardDescription className="text-sm text-zinc-600 dark:text-zinc-400 text-center">
              Enter your new password below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-zinc-700 dark:text-zinc-300"
                >
                  New Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your new password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className={`border-2 rounded-lg p-2 w-full transition-colors ${
                    errors.password
                      ? "border-red-500"
                      : "border-zinc-300 dark:border-zinc-600"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
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
                  "Reset Password"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
