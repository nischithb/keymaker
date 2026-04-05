import { db } from "@/db";
import { checkForUniqueViolation } from "@/db/errors";
import { Constraints, sessionsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SessionTokenAlreadyExists } from "../errors";

async function getSessionByToken(sessionToken: string) {
  const [session] = await db
    .select({
      id: sessionsTable.id,
      userId: sessionsTable.userId,
      expiresAt: sessionsTable.expiresAt,
      sudoExpiresAt: sessionsTable.sudoExpiresAt,
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

async function upgradeToSudoById(sessionId: string, sudoDuration: number) {
  const [session] = await db
    .update(sessionsTable)
    .set({ sudoExpiresAt: new Date(Date.now() + sudoDuration) })
    .where(eq(sessionsTable.id, sessionId))
    .returning({ id: sessionsTable.id });
  return session ?? null;
}

const sessionRepository = {
  getSessionByToken,
  createSession,
  deleteSessionByToken,
  upgradeToSudoById,
};

export default sessionRepository;
