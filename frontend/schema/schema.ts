import exp from "constants";
import { z } from "zod";

export const signUpSchema = z.object({
  firstName: z.string().min(3, "First name is required"),
  lastName: z.string().min(3, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/(?=.*[a-z])/, "Password must contain at least one lowercase letter")
    .regex(/(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
    .regex(/(?=.*\d)/, "Password must contain at least one number")
    .regex(
      /(?=.*[@$!%*?&])/,
      "Password must contain at least one special character"
    ),
});

export const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(3, "Invalid password"),
});

export const TwoFASchema = z.object({
  code: z
    .string()
    .min(6, "Invalid code")
    .regex(/^\d+$/, "Code must be numeric"),
});

export const SendPasswordResetMailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const PasswordResetSchema = z.object({
  password: z
  .string()
  .min(6, "Password must be at least 6 characters long")
  .regex(/(?=.*[a-z])/, "Password must contain at least one lowercase letter")
  .regex(/(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
  .regex(/(?=.*\d)/, "Password must contain at least one number")
  .regex(
    /(?=.*[@$!%*?&])/,
    "Password must contain at least one special character"
  ),
});
