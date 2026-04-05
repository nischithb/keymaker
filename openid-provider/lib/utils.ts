import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type FormActionResponse<T> = Promise<{
  success: boolean;
  formErrors?: string[];
  values?: { [key in keyof T]?: string };
  fieldErrors?: {
    [key in keyof T]?: string[];
  };
}>;

type Ok<T = void> = T extends void ? { ok: true } : { ok: true; data: T };
type Err<E> = { ok: false; error: E };
export type Result<T = void, E = Error> = Ok<T> | Err<E>;
export type ResultAsync<T, E> = Promise<Result<T, E>>;

export const ok = <T = void>(
  ...args: T extends void ? [] : [data: T]
): Result<T, never> => {
  return (
    args.length === 0 ? { ok: true } : { ok: true, data: args[0] }
  ) as Result<T, never>;
};
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

export const sleep = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay));
