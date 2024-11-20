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

const SizeStockSchema = z.object({
  size: z.string(),  // Size of the variant (e.g., '6', '7', '9', etc.)
  stockQuantity: z.number().int().min(0),  // Quantity in stock for the specific size
});

// Define the schema for product images by color
const ColorOptionImagesSchema = z.array(z.string().url());  // Array of image URLs for a specific color

// Define the schema for a product variant
const ProductVariantSchema = z.object({
  color: z.string().min(1),  // Color of the variant (e.g., 'White', etc.)
  price: z.number().positive(),  // Price of the variant
  discount: z.number().min(0).max(100),  // Discount in percentage
  stockQuantity: z.number().int().min(0),  // Total stock quantity of the variant
  sizes: z.array(SizeStockSchema),  // Array of sizes and their stock quantities
  colorOptionImages: ColorOptionImagesSchema,  // Array of image URLs for the color
  sku: z.string().min(1),  // SKU for the variant (optional)
});

export const productSchema = z.object({
  id: z.string().uuid(),  // Product ID (UUID format)
  name: z.string().min(1, "Name is required"),  // Name of the product
  description: z.string().min(1, "Description is required"),  // Product description
  price: z.number().positive(),  // Base price of the product (not variant-specific)
  discount: z.number().min(0).max(100),  // Base discount percentage
  sku: z.string().min(1),  // Product SKU (global identifier)
  tags: z.array(z.string()),  // Optional array of tags (e.g., ['basketball', 'sports'])
  category: z.string().min(1),  // Product category (e.g., 'Shoes')
  rating: z.number().min(0).max(5).optional(),  // Product rating (optional)
  releaseDate: z.string().optional(),  // Optional release date (could be a string like '2024-11-01')
  active: z.boolean().optional(),  // Whether the product is active (optional)
  weight: z.string().optional(),  // Weight of the product (optional)
  dimensions: z.string().optional(),  // Dimensions of the product (optional)
  createdAt: z.string().optional(),  // Date when the product was created
  updatedAt: z.string().optional(),  // Last updated date of the product
  productURL: z.string().url().optional(),  // Product URL (optional)
  material: z.string().min(1).optional(),  // Material of the product (required)
  gender: z.enum(["mens", "womens", "unisex"]),  // Gender for which the product is designed (optional)
  type: z.string().optional(),  // Type of product (e.g., 'Basketball Shoes', optional)
  brand: z.string(),  // Product brand (optional)
  manufacturer: z.string().nullable().optional(),  // Manufacturer details (optional)
  featured: z.boolean().optional(),  // Whether the product is featured (optional)
  variants: z.array(ProductVariantSchema).min(1, "Atleast One Variant is required"),  // Array of variants (colors, sizes, etc.)
});


export const UpdateProductSchema = z.object({
  id: z.string().uuid(),  // Product ID (UUID format)
  name: z.string().min(1).optional(),  // Name of the product
  description: z.string().min(1).optional(),  // Product description
  price: z.number().positive().optional(),  // Base price of the product (not variant-specific)
  discount: z.number().min(0).max(100).optional(),  // Base discount percentage
  sku: z.string().min(1).optional(),  // Product SKU (global identifier)
  tags: z.array(z.string()).optional(),  // Optional array of tags (e.g., ['basketball', 'sports'])
  category: z.string().min(1).optional(),  // Product category (e.g., 'Shoes')
  rating: z.number().min(0).max(5).optional(),  // Product rating (optional)
  releaseDate: z.string().optional(),  // Optional release date (could be a string like '2024-11-01')
  active: z.boolean().optional(),  // Whether the product is active (optional)
  weight: z.string().optional(),  // Weight of the product (optional)
  dimensions: z.string().optional(),  // Dimensions of the product (optional)
  createdAt: z.string().optional(),  // Date when the product was created
  updatedAt: z.string().optional(),  // Last updated date of the product
  productURL: z.string().url().optional(),  // Product URL (optional)
  material: z.string().min(1).optional(),  // Material of the product (required)
  gender: z.enum(["mens", "womens", "unisex"]).optional(),  // Gender for which the product is designed (optional)
  type: z.string().optional(),  // Type of product (e.g., 'Basketball Shoes', optional)
  brand: z.string().optional(),  // Product brand (optional)
  manufacturer: z.string().optional(),  // Manufacturer details (optional)
  featured: z.boolean().optional(),  // Whether the product is featured (optional)
  variants: z.array(ProductVariantSchema).optional(),  // Array of variants (colors, sizes, etc.)
});