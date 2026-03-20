"use server";

import { RegisterApplicationSchema } from "@/lib/definitions";
import clientRepository from "@/lib/repositories/client";
import { generateRandomString } from "@/lib/server-utils";
import { verifySession } from "@/lib/session";
import { FormActionResponse } from "@/lib/utils";
import { redirect, RedirectType } from "next/navigation";
import z from "zod";

export async function registerApplication(
  state: unknown,
  formData: FormData,
): Promise<FormActionResponse<z.infer<typeof RegisterApplicationSchema>>> {
  const verificationResult = await verifySession();
  if (!verificationResult.success) redirect("/login");

  const data = {
    name: formData.get("app-name")?.toString(),
    description: formData.get("app-description")?.toString(),
    homepageUrl: formData.get("homepage-url")?.toString(),
    callbackUrl: formData.get("callback-url")?.toString(),
  };
  const validatedResult = RegisterApplicationSchema.safeParse(data);
  if (!validatedResult.success) {
    return {
      ...z.flattenError(validatedResult.error),
      success: false,
      values: data,
    };
  }

  const clientId = generateRandomString();
  const client = await clientRepository.createClient({
    ...validatedResult.data,
    id: clientId,
    ownerId: verificationResult.userId,
  });
  if (!client) {
    return {
      success: false,
      values: data,
      formErrors: ["Failed to register new client"],
    };
  }

  return redirect(`/applications/${client.id}`, RedirectType.replace);
}
