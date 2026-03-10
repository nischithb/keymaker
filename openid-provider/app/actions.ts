"use server";

import { SignupFormSchema } from "@/lib/definitions";
import { EmailAlreadyExists } from "@/lib/errors";
import userRepository from "@/lib/repositories/user";
import { createSession, deleteSession } from "@/lib/session";
import { hashPassword } from "@/lib/server-utils";
import { redirect } from "next/navigation";
import z from "zod";
import { FormActionResponse } from "@/lib/utils";

export async function signup(
  state: unknown,
  formData: FormData,
): Promise<FormActionResponse<z.infer<typeof SignupFormSchema>>> {
  const data = {
    name: formData.get("name")?.toString(),
    email: formData.get("email")?.toString(),
    password: formData.get("password")?.toString(),
  };
  const validationResult = SignupFormSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      ...z.flattenError(validationResult.error),
      success: false,
      values: data,
    };
  }

  try {
    const userData = {
      ...validationResult.data,
      password: await hashPassword(validationResult.data.password),
    };
    const user = await userRepository.createUser(userData);
    if (!user) throw new Error("Failed to create user");
    await createSession(user.id);
  } catch (error) {
    if (error instanceof EmailAlreadyExists) {
      return {
        success: false,
        fieldErrors: { email: [error.message] },
        values: data,
      };
    }
    console.error(error);
    return {
      success: false,
      formErrors: ["Sorry, Something went wrong on our end"],
    };
  }
  redirect("/account");
}

export async function logout() {
  try {
    await deleteSession();
  } catch (error) {
    console.error(error);
    return { success: false };
  }
  redirect("/signup");
}
