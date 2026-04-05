import "server-only";
import { cookies } from "next/headers";
import sessionRepository from "./repositories/session";
import { SessionTokenAlreadyExists } from "./errors";
import { generateRandomString } from "./server-utils";
import { cache } from "react";
import { err, ok, ResultAsync } from "./utils";

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

async function _verifySession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(cookie.name);
  if (!sessionCookie) return null;

  const session = await sessionRepository.getSessionByToken(
    sessionCookie.value,
  );
  if (!session) return null;

  if (session.expiresAt <= new Date()) {
    await sessionRepository.deleteSessionByToken(sessionCookie.value);
    return null;
  }
  return session;
}

/**
 * @returns userId on successful verification else false
 * @description Deletes session in the database if session expired,
 * but does not mutate cookie, safe to use in RSC
 * @see https://nextjs.org/docs/app/api-reference/functions/cookies#understanding-cookie-behavior-in-server-components
 */
export const verifySession = cache(
  async (): ResultAsync<
    { userId: string; sessionId: string },
    "invalid_session"
  > => {
    const session = await _verifySession();
    if (!session) return err("invalid_session");
    else return ok({ userId: session.userId, sessionId: session.id });
  },
);

export async function deleteSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(cookie.name);
  if (!sessionCookie) return;
  await sessionRepository.deleteSessionByToken(sessionCookie.value);
  cookieStore.delete(cookie.name);
}

export async function verifySudoSession(): ResultAsync<
  { userId: string },
  "invalid_session" | "not_sudo"
> {
  const session = await _verifySession();
  if (!session) return err("invalid_session");
  if (!session.sudoExpiresAt || session.sudoExpiresAt < new Date()) {
    return err("not_sudo");
  }
  return ok({ userId: session.userId });
}
