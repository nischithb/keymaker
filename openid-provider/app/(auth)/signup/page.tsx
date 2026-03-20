"use client";

import { signup } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/ui/password-input";
import { SpinnerIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useActionState } from "react";

export default function Page() {
  const [state, action, isPending] = useActionState(signup, null);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-lg">Create your account</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action}>
          <FieldGroup className="gap-6">
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                defaultValue={state?.values?.name}
                disabled={isPending}
                required
              />
              <FieldError errors={state?.fieldErrors?.name} />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                defaultValue={state?.values?.email}
                disabled={isPending}
                required
              />
              <FieldError errors={state?.fieldErrors?.email} />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <PasswordInput
                id="password"
                name="password"
                autoComplete="new-password"
                defaultValue={state?.values?.password}
                disabled={isPending}
                required
              />
              {(state?.fieldErrors?.password?.length ?? 0 > 0) && (
                <p className="text-destructive text-xs">Password must:</p>
              )}
              <FieldError errors={state?.fieldErrors?.password} />
            </Field>

            <FieldError errors={state?.formErrors} />

            <Field>
              <Button type="submit" disabled={isPending}>
                {isPending && <SpinnerIcon className="animate-spin" />}
                Create Account
              </Button>
              <FieldDescription className="text-center">
                Already have an account? <Link href="/login">Sign in</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
