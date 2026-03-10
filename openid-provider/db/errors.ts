import { DatabaseError } from "pg";
import { Constraints } from "./schema";

/**
 * @see https://www.postgresql.org/docs/current/errcodes-appendix.html
 */
enum DbError {
  UNIQUE_VIOLATION = "23505",
}

type Constraint = (typeof Constraints)[keyof typeof Constraints];

export function checkForUniqueViolation(
  error: unknown,
  constraint: Constraint,
): boolean {
  if (!(error instanceof Error) || !(error.cause instanceof DatabaseError)) {
    return false;
  }
  if (error.cause.code !== DbError.UNIQUE_VIOLATION) return false;
  return error.cause.constraint === constraint;
}
