"use client";

import { useActionState, useState } from "react";
import {
  deleteClientSecret,
  generateClientSecret,
  updateApplication,
} from "../actions";
import { Button } from "@/components/ui/button";
import ApplicationForm from "@/components/application-form";
import { Separator } from "@/components/ui/separator";
import ReAuthForm from "@/components/reauth-form";
import { SpinnerIcon, TrashIcon } from "@phosphor-icons/react";
import CopyButton from "@/components/ui/copy-button";

interface AppConfigStatefulProps {
  client: {
    id: string;
    name: string;
    callbackUrl: string;
    homepageUrl: string;
    description: string | null;
  };
  secrets: {
    id: string;
    displayText: string;
    createdAt: Date;
    secret?: string;
  }[];
}

type OngoingAction =
  | { type: "generate_secret" }
  | { type: "delete_secret"; secretId: string }
  | null;

export default function AppConfigStateful({
  client,
  secrets: initialSecrets,
}: AppConfigStatefulProps) {
  const [ongoingAction, setOngoingAction] = useState<OngoingAction>(null);
  const [secrets, setSecrets] = useState(initialSecrets);
  const [reauthOpen, setReauthOpen] = useState(false);
  const [state, action, isPending] = useActionState(updateApplication, {
    values: { ...client, description: client.description ?? undefined },
    success: false,
  });

  async function handleGenerateClientSecret() {
    setOngoingAction({ type: "generate_secret" });
    const result = await generateClientSecret(client.id);
    if (!result.ok) {
      if (result.error === "not_sudo") {
        setReauthOpen(true);
      }
      return;
    }

    setSecrets((prev) => [result.data, ...prev]);
    setOngoingAction(null);
  }

  async function handleDeleteClientSecret(secretId: string) {
    setOngoingAction({ type: "delete_secret", secretId });
    const result = await deleteClientSecret(secretId, client.id);
    if (!result.ok) {
      if (result.error === "not_sudo") {
        setReauthOpen(true);
      }
      return;
    }
    setSecrets((prev) => prev.filter((secret) => secret.id !== secretId));
    setOngoingAction(null);
  }

  async function reauthCallback() {
    setReauthOpen(false);
    switch (ongoingAction?.type) {
      case "generate_secret":
        await handleGenerateClientSecret();
        break;
      case "delete_secret":
        await handleDeleteClientSecret(ongoingAction.secretId);
        break;
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <h2 className="text-lg">Client Secrets</h2>
          <Button variant="secondary" onClick={handleGenerateClientSecret}>
            {ongoingAction?.type === "generate_secret" && (
              <SpinnerIcon className="animate-spin" />
            )}
            Generate Client Secret
          </Button>
        </div>
        {secrets.length === 0 && (
          <div className="flex flex-col items-center">
            <p className="text-sm">There are no client secrets</p>
          </div>
        )}
        {secrets.length !== 0 && (
          <ul className="flex flex-col gap-4">
            {secrets.map((clientSecret) => (
              <li
                className="border-2 p-4 flex justify-between items-center"
                key={clientSecret.id}
              >
                <div>
                  <div className="flex gap-2 items-center">
                    <p className="text-sm">
                      {clientSecret.secret ??
                        `************${clientSecret.displayText}`}
                    </p>
                    {clientSecret.secret && (
                      <CopyButton text={clientSecret.secret} />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Added on {clientSecret.createdAt.toLocaleString()}
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={
                    ongoingAction?.type === "delete_secret" &&
                    ongoingAction.secretId === clientSecret.id
                  }
                  onClick={() => handleDeleteClientSecret(clientSecret.id)}
                >
                  <TrashIcon className="text-red-500" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Separator />
      <div className="flex flex-col gap-4">
        <h2 className="text-lg">Client details</h2>
        <ApplicationForm
          form={{ type: "update", clientId: client.id }}
          action={action}
          disabled={isPending}
          fieldValues={state?.values}
          fieldErrors={state?.fieldErrors}
          formErrors={state?.formErrors}
        />
      </div>
      <ReAuthForm
        open={reauthOpen}
        successCallback={reauthCallback}
        onCancel={() => {
          setOngoingAction(null);
          setReauthOpen(false);
        }}
      />
    </>
  );
}
