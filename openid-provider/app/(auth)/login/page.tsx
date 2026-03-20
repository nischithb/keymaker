"use client";

import { login } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  const [state, action, isPending] = useActionState(login, null);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center mb-2">
        <CardTitle className="text-lg">Welcome back</CardTitle>
        <CardDescription className="text-sm">
          Login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action}>
          <FieldGroup>
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
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Link href="#">Forgot your password?</Link>
              </div>
              <PasswordInput
                id="password"
                name="password"
                autoComplete="current-password"
                disabled={isPending}
                required
              />
              <FieldError errors={state?.fieldErrors?.password} />
            </Field>

            <FieldError errors={state?.formErrors} />

            <Field>
              <Button type="submit" disabled={isPending}>
                {isPending && <SpinnerIcon className="animate-spin" />}
                Login
              </Button>
              <FieldDescription className="text-center">
                Don&apos;t have an account? <Link href="/signup">Sign up</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
