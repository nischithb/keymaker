import "server-only";
import * as argon2 from "argon2";
import { randomBytes } from "crypto";

export async function hashString(plaintext: string) {
  return await argon2.hash(plaintext);
}

export async function verifyHash(digest: string, plaintext: string) {
  return await argon2.verify(digest, plaintext);
}

export function generateRandomString(size = 32) {
  return randomBytes(size).toString("base64url");
}
