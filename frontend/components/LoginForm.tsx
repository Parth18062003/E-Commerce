import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageContainer from "./ShaderCanvas";

export const description =
  "A login page with two columns. The first column has the login form with email and password. There's a Forgot your password link and a link to sign up if you do not have an account. The second column has a cover image.";

export function LoginForm() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      {/* Login Form Column */}
      <div className="flex items-center justify-center bg-white dark:bg-gray-900 py-12 px-6 lg:px-16">
        <div className="mx-auto max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
              Hype House
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email below to login to your account
            </p>
          </div>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="transition-transform duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-blue-500 hover:text-blue-600 transition duration-300"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                className="transition-transform duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-500 text-white hover:bg-blue-600 transition duration-300 ease-in-out"
            >
              Login
            </Button>
            <Button
              variant="outline"
              className="w-full text-blue-500 border-blue-500 hover:bg-blue-50 transition duration-300 ease-in-out"
            >
              Login with Google
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="#"
              className="text-blue-500 hover:text-blue-600 transition duration-300"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
      {/* Cover Image Column */}
      <div className="relative lg:block lg:w-full lg:h-screen">
        <ImageContainer imageUrl="https://static.nike.com/a/images/f_auto/dpr_1.3,cs_srgb/h_700,c_limit/56e7677b-c5b6-4b84-9f09-5db7740fb885/image.png" />
      </div>
    </div>
  );
}
