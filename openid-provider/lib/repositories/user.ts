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
  password: string;
}) {
  try {
    const [user] = await db
      .insert(usersTable)
      .values(userData)
      .returning({ id: usersTable.id });
    return user ?? null;
  } catch (error) {
    if (checkForUniqueViolation(error, Constraints.USERS_EMAIL_UNIQUE)) {
      throw new EmailAlreadyExists();
    }
    throw error;
  }
}

async function getUserPasswordByEmail(email: string) {
  const [user] = await db
    .select({ id: usersTable.id, password: usersTable.password })
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);
  return user ?? null;
}

const userRepository = {
  createUser,
  getUserPasswordByEmail,
};

export default userRepository;
