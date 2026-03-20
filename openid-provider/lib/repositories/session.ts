import { db } from "@/db";
import { checkForUniqueViolation } from "@/db/errors";
import { Constraints, sessionsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SessionTokenAlreadyExists } from "../errors";

async function getSessionByToken(sessionToken: string) {
  const [session] = await db
    .select({
      userId: sessionsTable.userId,
      expiresAt: sessionsTable.expiresAt,
    })
    .from(sessionsTable)
    .where(eq(sessionsTable.token, sessionToken))
    .limit(1);
  return session ?? null;
}

/**
 * @throws `SessionTokenAlreadyExists` if provided token is
 * associated with another session
 */
async function createSession(sessionData: typeof sessionsTable.$inferInsert) {
  try {
    const [session] = await db
      .insert(sessionsTable)
      .values(sessionData)
      .returning({ id: sessionsTable.id });
    return session ?? null;
  } catch (error) {
    if (checkForUniqueViolation(error, Constraints.SESSIONS_TOKEN_UQ)) {
      throw new SessionTokenAlreadyExists();
    }
    throw error;
  }
}

async function deleteSessionByToken(sessionToken: string) {
  await db.delete(sessionsTable).where(eq(sessionsTable.token, sessionToken));
}

const sessionRepository = {
  getSessionByToken,
  createSession,
  deleteSessionByToken,
};

export default sessionRepository;
