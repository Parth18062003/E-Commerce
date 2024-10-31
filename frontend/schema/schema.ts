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


export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.preprocess((val) => (typeof val === "string" ? parseFloat(val) : val), 
    z.number().positive("Price must be a positive number")),
  discount: z.preprocess((val) => (typeof val === "string" ? parseFloat(val) : val), 
    z.number().nonnegative("Discount cannot be negative")),
  stockQuantity: z.preprocess((val) => (typeof val === "string" ? parseInt(val, 10) : val), 
    z.number().int("Stock must be an integer")),
  category: z.string().min(1, "Category is required"),
  brand: z.string().min(1, "Brand is required"),
  sku: z.string().min(1, "SKU is required"),
  tags: z.preprocess((val) => (typeof val === "string" ? val.split(",").map(tag => tag.trim()) : val), 
    z.array(z.string()).optional()), // Optional if no tags are provided
  dimensions: z.string().min(1, "Dimensions are required"),
  weight: z.string().min(1, "Weight is required"),
  sizes: z.preprocess((val) => (typeof val === "string" ? val.split(",").map(size => size.trim()) : val), 
    z.array(z.string()).optional()), // Optional if no sizes are provided
    colorOptions: z.preprocess(
      (val) => (typeof val === "string" ? val.split(",").map(color => color.trim()) : val),
      z.array(z.string()).optional()
    ),// Optional if no color options are provided
  colorOptionImages: z.record(z.array(z.string())).optional(), // Object with arrays of images for each color
});

export const updateProductSchema = z.object({
  name: z.string().min(1, "Product name is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  price: z.preprocess((val) => (typeof val === "string" ? parseFloat(val) : val), 
    z.number().positive("Price must be a positive number")).optional(),
  discount: z.preprocess((val) => (typeof val === "string" ? parseFloat(val) : val), 
    z.number().nonnegative("Discount cannot be negative")).optional(),
  stockQuantity: z.preprocess((val) => (typeof val === "string" ? parseInt(val, 10) : val), 
    z.number().int("Stock must be an integer")).optional(),
  category: z.string().min(1, "Category is required").optional(),
  brand: z.string().min(1, "Brand is required").optional(),
  sku: z.string().min(1, "SKU is required").optional(),
  tags: z.preprocess((val) => (typeof val === "string" ? val.split(",").map(tag => tag.trim()) : val), 
    z.array(z.string()).optional()), // Optional if no tags are provided
  dimensions: z.string().min(1, "Dimensions are required").optional(),
  weight: z.string().min(1, "Weight is required").optional(),
  sizes: z.preprocess((val) => (typeof val === "string" ? val.split(",").map(size => size.trim()) : val), 
    z.array(z.string()).optional()), // Optional if no sizes are provided
    colorOptions: z.preprocess(
      (val) => (typeof val === "string" ? val.split(",").map(color => color.trim()) : val),
      z.array(z.string()).optional()
    ),// Optional if no color options are provided
  colorOptionImages: z.record(z.array(z.string())).optional(), // Object with arrays of images for each color
});