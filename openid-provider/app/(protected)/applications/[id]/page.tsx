import clientRepository from "@/lib/repositories/client";
import { verifySession } from "@/lib/session";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import AppConfigStateful from "./app-config-stateful";
import CopyButton from "@/components/ui/copy-button";

export default async function ApplicationConfigurationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const verificationResult = await verifySession();
  if (!verificationResult.ok) return null;

  const { id } = await params;
  const client = await clientRepository.getClientByIdAndOwnerId(
    id,
    verificationResult.data.userId,
  );
  if (!client) notFound();

  const secretsList = await clientRepository.getClientSecretsByClientId(
    client.id,
  );

  return (
    <main className="mx-auto max-w-xl flex flex-col gap-6 mt-20">
      <h1 className="text-2xl">{client.name}</h1>
      <Separator />
      <div className="flex flex-col gap-2">
        <h2 className="text-lg">Client ID</h2>
        <div className="flex gap-2 items-center">
          <p className="text-sm">{client.id}</p>
          <CopyButton text={client.id} />
        </div>
      </div>
      <Separator />

      <AppConfigStateful client={client} secrets={secretsList} />
    </main>
  );
}
