import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import slugify from 'slugify';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const createSlug = (name: string) => {
  return slugify(name, {
    lower: true,        // Convert to lowercase
    strict: true        // Remove non-alphanumeric characters
  });
};