import {
  foreignKey,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const Constraints = {
  USERS_PK: "users_pkey",
  USERS_EMAIL_UNIQUE: "users_email_unique",
  SESSIONS_PK: "sessions_pkey",
  SESSIONS_TOKEN_UNIQUE: "sessions_token_unique",
  SESSIONS_USER_ID_FK: "sessions_user_id_users_id_fk",
} as const;

export const usersTable = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    password: text("password").notNull(),
  },
  (t) => [
    primaryKey({ name: Constraints.USERS_PK, columns: [t.id] }),
    unique(Constraints.USERS_EMAIL_UNIQUE).on(t.email),
  ],
);

export const sessionsTable = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().notNull(),
    token: text("token").notNull(),
    userId: uuid("user_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (t) => [
    primaryKey({ name: Constraints.SESSIONS_PK, columns: [t.id] }),
    unique(Constraints.SESSIONS_TOKEN_UNIQUE).on(t.token),
    foreignKey({
      name: Constraints.SESSIONS_USER_ID_FK,
      columns: [t.userId],
      foreignColumns: [usersTable.id],
    }).onDelete("cascade"),
  ],
);
