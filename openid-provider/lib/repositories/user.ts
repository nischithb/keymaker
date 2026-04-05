import { db } from "@/db";
import { Constraints, usersTable } from "@/db/schema";
import { EmailAlreadyExists } from "../errors";
import { checkForUniqueViolation } from "@/db/errors";
import { eq } from "drizzle-orm";

/**
 * @returns object with `id` of the created user
 * @throws `EmailAlreadyExists` error if provided email is
 * associated with an existing account
 */
async function createUser(userData: {
  name: string;
  email: string;
  passwordHash: string;
}) {
  try {
    const [user] = await db
      .insert(usersTable)
      .values(userData)
      .returning({ id: usersTable.id });
    return user ?? null;
  } catch (error) {
    if (checkForUniqueViolation(error, Constraints.USERS_EMAIL_UQ)) {
      throw new EmailAlreadyExists();
    }
    throw error;
  }
}

async function getPasswordHashByEmail(email: string) {
  const [user] = await db
    .select({ id: usersTable.id, password: usersTable.passwordHash })
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);
  return user ?? null;
}

async function getPasswordHashByUserId(userId: string) {
  const [user] = await db
    .select({ passwordHash: usersTable.passwordHash })
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);
  return user ?? null;
}

const userRepository = {
  createUser,
  getPasswordHashByEmail,
  getPasswordHashByUserId,
};

export default userRepository;
