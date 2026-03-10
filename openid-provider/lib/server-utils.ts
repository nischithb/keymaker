import "server-only";
import * as argon2 from "argon2";

export async function hashPassword(password: string) {
  return await argon2.hash(password);
}

export async function verifyPassword(hash: string, plain: string) {
  return await argon2.verify(hash, plain);
}
