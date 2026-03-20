"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useActionState } from "react";
import { registerApplication } from "../actions";
import { SpinnerIcon } from "@phosphor-icons/react";

export default function RegisterApplicationPage() {
  const [state, action, isPending] = useActionState(registerApplication, null);

  return (
    <main>
      <div className="mx-auto max-w-md mt-20 md:mt-40">
        <h1 className="mb-10 text-xl">Register a new application</h1>
        <form action={action}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="app-name">Application name</FieldLabel>
              <Input
                id="app-name"
                name="app-name"
                type="text"
                defaultValue={state?.values?.name}
                disabled={isPending}
                required
              />
              <FieldDescription>
                Something users will recognize and trust.
              </FieldDescription>
              <FieldError errors={state?.fieldErrors?.name} />
            </Field>

            <Field>
              <FieldLabel htmlFor="homepage-url">Homepage URL</FieldLabel>
              <Input
                id="homepage-url"
                name="homepage-url"
                type="url"
                defaultValue={state?.values?.homepageUrl}
                disabled={isPending}
                required
              />
              <FieldDescription>
                The full URL to your application homepage.
              </FieldDescription>
              <FieldError errors={state?.fieldErrors?.homepageUrl} />
            </Field>

            <Field>
              <FieldLabel htmlFor="app-description">
                Application description
              </FieldLabel>
              <Textarea
                id="app-description"
                name="app-description"
                defaultValue={state?.values?.description}
                disabled={isPending}
              />
              <FieldDescription>
                This is displayed to all users of your application
              </FieldDescription>
              <FieldError errors={state?.fieldErrors?.description} />
            </Field>

            <Field>
              <FieldLabel htmlFor="callback-url">Callback URL</FieldLabel>
              <Input
                id="callback-url"
                name="callback-url"
                type="url"
                defaultValue={state?.values?.callbackUrl}
                disabled={isPending}
                required
              />
              <FieldDescription>
                Your Application&apos;s callback URL
              </FieldDescription>
              <FieldError errors={state?.fieldErrors?.callbackUrl} />
            </Field>

            <FieldError errors={state?.formErrors} />

            <Field orientation="horizontal">
              <Button type="submit" disabled={isPending}>
                {isPending && <SpinnerIcon className="animate-spin" />}
                Register application
              </Button>
              <Button type="button" variant="secondary" disabled={isPending}>
                Cancel
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </main>
  );
}
