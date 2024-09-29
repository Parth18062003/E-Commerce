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

export const UpdateUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long").optional(),
  firstName: z.string().min(3, "First name must be at least 3 characters long").optional(),
  lastName: z.string().min(3, "Last name must be at least 3 characters long").optional(),
  email: z.string().email("Invalid email address").optional(),
  phoneNumber: z.string()
    .min(10, "Phone number must be at least 10 digits long")
    .regex(/^\d+$/, "Phone number must be numeric")
    .optional(),
  address: z.string().min(3, "Address must be at least 3 characters long").optional(),
  city: z.string().min(2, "City must be at least 2 characters long").optional(),
  state: z.string().min(2, "State must be at least 2 characters long").optional(),
  country: z.string().min(2, "Country must be at least 2 characters long").optional(),
  postalCode: z.string()
    .min(6, "Postal code must be at least 6 digits long")
    .regex(/^\d+$/, "Postal code must be numeric")
    .optional(),
});