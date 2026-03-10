import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface FormActionResponse<T> {
  success: boolean;
  formErrors?: string[];
  values?: { [key in keyof T]?: string };
  fieldErrors?: {
    [key in keyof T]?: string[];
  };
}

export const sleep = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay));
