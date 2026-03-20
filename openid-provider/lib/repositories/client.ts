import { db } from "@/db";
import { clientSecretsTable, clientsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

async function getClientByIdAndOwnerId(clientId: string, ownerId: string) {
  const [app] = await db
    .select({
      id: clientsTable.id,
      name: clientsTable.name,
      description: clientsTable.description,
      homepageUrl: clientsTable.homepageUrl,
      callbackUrl: clientsTable.callbackUrl,
    })
    .from(clientsTable)
    .where(
      and(eq(clientsTable.id, clientId), eq(clientsTable.ownerId, ownerId)),
    )
    .limit(1);
  return app ?? null;
}

async function createClient(appData: typeof clientsTable.$inferInsert) {
  const [app] = await db
    .insert(clientsTable)
    .values(appData)
    .returning({ id: clientsTable.id });
  return app ?? null;
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

const clientRepository = {
  getClientByIdAndOwnerId,
  createClient,
  getClientSecretsByClientId,
};

export default clientRepository;
