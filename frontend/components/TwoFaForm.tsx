"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { TwoFASchema } from "@/schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import Cookies from "js-cookie";

type TwoFAFormData = z.infer<typeof TwoFASchema>;

export default function TwoFAForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("email");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TwoFAFormData>({
    resolver: zodResolver(TwoFASchema),
  });

  const onSubmit: SubmitHandler<{ code: string }> = async (data) => {
    setLoading(true);
    setApiError(null);

    if (!username) {
      setApiError("Username is not defined.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8081/api/v1/auth/verify-2fa",
        {
          usernameOrEmail: username,
          code: data.code,
        }
      );

      Cookies.set("token", response.data.token, { expires: 7, path: '/' });
      // Redirect to dashboard or wherever you need
      router.push(`/dashboard/user/${response.data.userId}`);
      reset();
    } catch (error: any) {
      setApiError(error.response?.data.message || "Invalid code.");
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
              2FA Verification
            </CardTitle>
            <CardDescription className="text-sm text-zinc-600 dark:text-zinc-400 text-center">
            Enter your 2FA code below to log in to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="code"
                  className="text-zinc-700 dark:text-zinc-300"
                >
                  Code
                </Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter your 2FA code"
                  {...register("code", { required: "Code is required" })}
                  className={`border-2 rounded-lg p-2 w-full transition-colors ${
                    errors.code
                      ? "border-red-500"
                      : "border-zinc-300 dark:border-zinc-600"
                  } focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
                />
                {errors.code && (
                  <p className="text-red-500 text-sm">{errors.code.message}</p>
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
                  "Send 2fa Code"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
