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
  // usersTable
  USERS_PK: "users_pk",
  USERS_EMAIL_UQ: "users_email_uq",

  // sessionsTable
  SESSIONS_PK: "sessions_pk",
  SESSIONS_TOKEN_UQ: "sessions_token_uq",
  SESSIONS_USER_ID_FK: "sessions_user_id_fk",

  // clientsTable
  CLIENTS_PK: "clients_pk",
  CLIENTS_OWNER_ID_FK: "clients_owner_id_fk",

  // clientSecretsTable
  CLIENT_SECRETS_PK: "client_secrets_pk",
  CLIENT_SECRETS_CLIENT_ID_FK: "client_secrets_client_id_fk",
} as const;

const createdAt = timestamp("created_at").defaultNow().notNull();
const updatedAt = timestamp("updated_at").defaultNow().notNull();

export const usersTable = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
  },
  (t) => [
    primaryKey({ name: Constraints.USERS_PK, columns: [t.id] }),
    unique(Constraints.USERS_EMAIL_UQ).on(t.email),
  ],
);

export const sessionsTable = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().notNull(),
    token: text("token").notNull(),
    userId: uuid("user_id").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    sudoExpiresAt: timestamp("sudo_expires_at"),
    createdAt,
  },
  (t) => [
    primaryKey({ name: Constraints.SESSIONS_PK, columns: [t.id] }),
    unique(Constraints.SESSIONS_TOKEN_UQ).on(t.token),
    foreignKey({
      name: Constraints.SESSIONS_USER_ID_FK,
      columns: [t.userId],
      foreignColumns: [usersTable.id],
    }).onDelete("cascade"),
  ],
);

export const clientsTable = pgTable(
  "clients",
  {
    id: text("id").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    homepageUrl: text("homepage_url").notNull(),
    callbackUrl: text("callback_url").notNull(),
    ownerId: uuid("owner_id").notNull(),
    createdAt,
    updatedAt,
  },
  (t) => [
    primaryKey({ name: Constraints.CLIENTS_PK, columns: [t.id] }),
    foreignKey({
      name: Constraints.CLIENTS_OWNER_ID_FK,
      columns: [t.ownerId],
      foreignColumns: [usersTable.id],
    }).onDelete("cascade"),
  ],
);

export const clientSecretsTable = pgTable(
  "client_secrets",
  {
    id: uuid("id").defaultRandom().notNull(),
    secretHash: text("secret_hash").notNull(),
    clientId: text("client_id").notNull(),
    displayText: text("display_text").notNull(),
    createdAt,
  },
  (t) => [
    primaryKey({ name: Constraints.CLIENT_SECRETS_PK, columns: [t.id] }),
    foreignKey({
      name: Constraints.CLIENT_SECRETS_CLIENT_ID_FK,
      columns: [t.clientId],
      foreignColumns: [clientsTable.id],
    }).onDelete("cascade"),
  ],
);
