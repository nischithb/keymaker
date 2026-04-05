"use client";

import { useActionState } from "react";
import { registerApplication } from "../actions";
import ApplicationForm from "@/components/application-form";

export default function RegisterApplicationPage() {
  const [state, action, isPending] = useActionState(registerApplication, null);

  return (
    <main>
      <div className="mx-auto max-w-md mt-20 md:mt-40">
        <h1 className="mb-10 text-xl">Register a new application</h1>
        <ApplicationForm
          form={{ type: "register" }}
          action={action}
          disabled={isPending}
          formErrors={state?.formErrors}
          fieldValues={state?.values}
          fieldErrors={state?.fieldErrors}
        />
      </div>
    </main>
  );
}
