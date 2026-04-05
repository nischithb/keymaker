"use server";

import {
  PasswordReauthSchema,
  RegisterApplicationSchema,
  UpdateApplicationSchema,
} from "@/lib/definitions";
import clientRepository from "@/lib/repositories/client";
import sessionRepository from "@/lib/repositories/session";
import userRepository from "@/lib/repositories/user";
import {
  generateRandomString,
  hashString,
  verifyHash,
} from "@/lib/server-utils";
import { verifySession, verifySudoSession } from "@/lib/session";
import { err, FormActionResponse, ok, ResultAsync } from "@/lib/utils";
import { notFound, redirect, RedirectType } from "next/navigation";
import z from "zod";

export async function registerApplication(
  state: unknown,
  formData: FormData,
): FormActionResponse<z.infer<typeof RegisterApplicationSchema>> {
  const verificationResult = await verifySession();
  if (!verificationResult.ok) redirect("/login");

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
    ownerId: verificationResult.data.userId,
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

export async function updateApplication(
  state: unknown,
  formData: FormData,
): FormActionResponse<z.infer<typeof UpdateApplicationSchema>> {
  const data = {
    id: formData.get("id")?.toString(),
    name: formData.get("app-name")?.toString(),
    description: formData.get("app-description"),
    homepageUrl: formData.get("homepage-url")?.toString(),
    callbackUrl: formData.get("callback-url")?.toString(),
  };
  const validationResult = UpdateApplicationSchema.safeParse(data);
  if (!validationResult.success) {
    return {
      ...z.flattenError(validationResult.error),
      success: false,
    };
  }

  const sessionResult = await verifySession();
  if (!sessionResult.ok) redirect("/login");

  const { id: clientId, ...clientData } = validationResult.data;
  const client = await clientRepository.updateClient(
    clientId,
    sessionResult.data.userId,
    clientData,
  );
  if (!client) return { success: false, formErrors: ["No such client exists"] };

  return {
    success: true,
    values: { ...client, description: client.description ?? undefined },
  };
}

interface NewClientSecret {
  id: string;
  displayText: string;
  createdAt: Date;
  secret: string;
}

export async function generateClientSecret(
  clientId: string,
): ResultAsync<NewClientSecret, "not_sudo" | "unknown"> {
  const result = await verifySudoSession();
  if (!result.ok) {
    switch (result.error) {
      case "invalid_session":
        redirect("/login");
      case "not_sudo":
        return err("not_sudo");
    }
  }
  const client = await clientRepository.checkClientOwnership(
    clientId,
    result.data.userId,
  );
  if (!client) notFound();

  const secret = generateRandomString();
  const displayText = secret.slice(-5);
  const secretHash = await hashString(secret);

  const clientSecret = await clientRepository.createClientSecret({
    clientId,
    secretHash,
    displayText,
  });
  if (!clientSecret) return err("unknown");
  return ok({ ...clientSecret, secret });
}

export async function deleteClientSecret(
  clientSecretId: string,
  clientId: string,
): ResultAsync<void, "not_sudo" | "not_found"> {
  const result = await verifySudoSession();
  if (!result.ok) {
    switch (result.error) {
      case "not_sudo":
        return err("not_sudo");
      case "invalid_session":
        redirect("/login");
    }
  }
  const client = await clientRepository.checkClientOwnership(
    clientId,
    result.data.userId,
  );
  if (!client) notFound();

  const secret = await clientRepository.deleteClientSecret(
    clientSecretId,
    clientId,
  );
  if (!secret) return err("not_found");

  return ok();
}

export async function enterSudoModeWithPassword(
  state: unknown,
  formData: FormData,
): FormActionResponse<z.infer<typeof PasswordReauthSchema>> {
  const data = {
    password: formData.get("password")?.toString(),
  };
  const validationResult = PasswordReauthSchema.safeParse(data);
  if (!validationResult.success) {
    return {
      ...validationResult.error,
      success: false,
      values: data,
    };
  }

  const sessionResult = await verifySession();
  if (!sessionResult.ok) redirect("/login");

  const user = await userRepository.getPasswordHashByUserId(
    sessionResult.data.userId,
  );
  if (!user) {
    return { success: false, formErrors: ["Something went wrong on our end"] };
  }

  const hashResult = await verifyHash(
    user.passwordHash,
    validationResult.data.password,
  );
  if (!hashResult) return { success: false, formErrors: ["Wrong password"] };

  const result = await sessionRepository.upgradeToSudoById(
    sessionResult.data.sessionId,
    5 * 60 * 1000,
  );
  if (!result) {
    return {
      success: false,
      formErrors: ["Failed to upgrade session to sudo mode"],
    };
  }

  return { success: true };
}
