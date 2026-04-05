import { db } from "@/db";
import { clientSecretsTable, clientsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const clientReturnFields = {
  id: clientsTable.id,
  name: clientsTable.name,
  description: clientsTable.description,
  homepageUrl: clientsTable.homepageUrl,
  callbackUrl: clientsTable.callbackUrl,
};

async function getClientByIdAndOwnerId(clientId: string, ownerId: string) {
  const [app] = await db
    .select(clientReturnFields)
    .from(clientsTable)
    .where(
      and(eq(clientsTable.id, clientId), eq(clientsTable.ownerId, ownerId)),
    )
    .limit(1);
  return app ?? null;
}

async function checkClientOwnership(clientId: string, ownerId: string) {
  const [client] = await db
    .select({ id: clientsTable.id })
    .from(clientsTable)
    .where(
      and(eq(clientsTable.id, clientId), eq(clientsTable.ownerId, ownerId)),
    )
    .limit(1);
  return client?.id === clientId;
}

async function createClient(appData: typeof clientsTable.$inferInsert) {
  const [app] = await db
    .insert(clientsTable)
    .values(appData)
    .returning({ id: clientsTable.id });
  return app ?? null;
}

type UpdateClientData = Omit<
  typeof clientsTable.$inferInsert,
  "id" | "ownerId" | "createdAt"
>;

async function updateClient(
  clientId: string,
  ownerId: string,
  clientData: UpdateClientData,
) {
  const [client] = await db
    .update(clientsTable)
    .set({ ...clientData, updatedAt: new Date() })
    .where(
      and(eq(clientsTable.id, clientId), eq(clientsTable.ownerId, ownerId)),
    )
    .returning(clientReturnFields);
  return client ?? null;
}

async function getClientSecretsByClientId(clientId: string) {
  const clientSecrets = await db
    .select({
      id: clientSecretsTable.id,
      displayText: clientSecretsTable.displayText,
      createdAt: clientSecretsTable.createdAt,
    })
    .from(clientSecretsTable)
    .where(eq(clientSecretsTable.clientId, clientId));
  return clientSecrets;
}

async function createClientSecret(
  data: typeof clientSecretsTable.$inferInsert,
) {
  const [secret] = await db.insert(clientSecretsTable).values(data).returning({
    id: clientSecretsTable.id,
    displayText: clientSecretsTable.displayText,
    createdAt: clientSecretsTable.createdAt,
  });
  return secret ?? null;
}

async function deleteClientSecret(clientSecretId: string, clientId: string) {
  const [secret] = await db
    .delete(clientSecretsTable)
    .where(
      and(
        eq(clientSecretsTable.id, clientSecretId),
        eq(clientSecretsTable.clientId, clientId),
      ),
    )
    .returning({ id: clientSecretsTable.id });
  return secret ?? null;
}

const clientRepository = {
  getClientByIdAndOwnerId,
  checkClientOwnership,
  createClient,
  updateClient,
  getClientSecretsByClientId,
  createClientSecret,
  deleteClientSecret,
};

export default clientRepository;
