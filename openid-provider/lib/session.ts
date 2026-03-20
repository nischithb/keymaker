import "server-only";
import { cookies } from "next/headers";
import sessionRepository from "./repositories/session";
import { SessionTokenAlreadyExists } from "./errors";
import { generateRandomString } from "./server-utils";
import { cache } from "react";

const cookie = {
  name: "session-token",
  maxAge: 24 * 60 * 60,
  httpOnly: true,
  sameSite: "lax",
  secure: true,
} as const;

function generateSessionToken() {
  return generateRandomString(32);
}

export async function createSession(userId: string) {
  // generate sessionToken and store in db,
  // if already exists repeat generation until maxTries reached
  let sessionToken: string | undefined;
  const maxTries = 5;
  for (let i = 1; i <= maxTries; i++) {
    sessionToken = generateSessionToken();
    try {
      const session = await sessionRepository.createSession({
        token: sessionToken,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + cookie.maxAge * 1000),
        userId,
      });
      if (session) break;
    } catch (error) {
      // check if error caused by duplicate session id
      if (error instanceof SessionTokenAlreadyExists && i != maxTries) {
        continue;
      }
      throw error;
    }
  }
  if (!sessionToken) throw Error("Failed to create session");

  //   set session token to cookies object
  const cookieStore = await cookies();
  cookieStore.set({ value: sessionToken, ...cookie });
}

/**
 * @returns userId on successful verification else false
 * @description Deletes session in the database if session expired,
 * but does not mutate cookie, safe to use in RSC
 * @see https://nextjs.org/docs/app/api-reference/functions/cookies#understanding-cookie-behavior-in-server-components
 */
async function _verifySession(): Promise<
  { success: true; userId: string } | { success: false }
> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(cookie.name);
  if (!sessionCookie) return { success: false };

  const session = await sessionRepository.getSessionByToken(
    sessionCookie.value,
  );
  if (!session) return { success: false };

  if (session.expiresAt <= new Date()) {
    await sessionRepository.deleteSessionByToken(sessionCookie.value);
    return { success: false };
  }
  return { success: true, userId: session.userId };
}

export const verifySession = cache(_verifySession);

export async function deleteSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(cookie.name);
  if (!sessionCookie) return;
  await sessionRepository.deleteSessionByToken(sessionCookie.value);
  cookieStore.delete(cookie.name);
}
