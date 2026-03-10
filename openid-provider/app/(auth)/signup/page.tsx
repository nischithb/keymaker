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
import { SpinnerIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useActionState } from "react";

export default function Page() {
  const [state, action, isPending] = useActionState(signup, null);

  const nameFieldErrors = state?.fieldErrors?.name?.map((error) => ({
    message: error,
  }));
  const emailFieldErrors = state?.fieldErrors?.email?.map((error) => ({
    message: error,
  }));
  const passwordFieldErrors = state?.fieldErrors?.password?.map((error) => ({
    message: error,
  }));

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-lg">Create your account</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action}>
          <FieldGroup className="gap-6">
            <Field>
              <FieldLabel htmlFor="signup-fullname">Full Name</FieldLabel>
              <Input
                id="signup-fullname"
                name="name"
                type="text"
                defaultValue={state?.values?.name}
                disabled={isPending}
                required
              />
              <FieldError errors={nameFieldErrors} />
            </Field>

            <Field>
              <FieldLabel htmlFor="signup-email">Email</FieldLabel>
              <Input
                id="signup-email"
                name="email"
                type="email"
                defaultValue={state?.values?.email}
                disabled={isPending}
                required
              />
              <FieldError errors={emailFieldErrors} />
            </Field>

            <Field>
              <FieldLabel htmlFor="signup-password">Password</FieldLabel>
              <Input
                id="signup-password"
                name="password"
                type="password"
                defaultValue={state?.values?.password}
                disabled={isPending}
                required
              />
              {passwordFieldErrors?.length !== 0 && (
                <p className="text-destructive text-xs">Password must:</p>
              )}
              <FieldError errors={passwordFieldErrors} />
            </Field>

            <Field>
              <Button type="submit" disabled={isPending}>
                {isPending && <SpinnerIcon className="animate-spin" />}
                Create Account
              </Button>
              <FieldDescription className="text-center">
                Already have an account? <Link href="#">Sign in</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
