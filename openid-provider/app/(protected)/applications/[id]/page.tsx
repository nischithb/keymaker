import clientRepository from "@/lib/repositories/client";
import { verifySession } from "@/lib/session";
import { notFound } from "next/navigation";

export default async function ApplicationConfigurationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const verificationResult = await verifySession();
  if (!verificationResult.success) return null;

  const { id } = await params;
  const client = await clientRepository.getClientByIdAndOwnerId(
    id,
    verificationResult.userId,
  );
  if (!client) notFound();

  return (
    <main>
      <h1>{client.name}</h1>
      <h2>Client ID</h2>
      <p>{client.id}</p>
    </main>
  );
}
