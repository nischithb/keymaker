"use client";

import { useActionState } from "react";
import { Field, FieldError, FieldLabel } from "./ui/field";
import PasswordInput from "./ui/password-input";
import { enterSudoModeWithPassword } from "@/app/(protected)/applications/actions";
import { SpinnerIcon } from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface ReAuthFormProps {
  open: boolean;
  successCallback: () => void;
  onCancel: () => void;
}

export default function ReAuthForm({
  open,
  successCallback,
  onCancel,
}: ReAuthFormProps) {
  async function wrappedAction(state: unknown, formData: FormData) {
    const result = await enterSudoModeWithPassword(null, formData);
    if (result.success) {
      successCallback();
    }
    return result;
  }

  const [state, action, isPending] = useActionState(wrappedAction, null);

  return (
    <Dialog open={open} onOpenChange={(state) => !state && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm access</DialogTitle>
          <DialogDescription>
            This action requires sudo mode. Enter password to enter into sudo
            mode
          </DialogDescription>
        </DialogHeader>

        <form action={action} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <PasswordInput
              id="password"
              name="password"
              required
              disabled={isPending}
            />
            <FieldError errors={state?.fieldErrors?.password} />
          </Field>
          <FieldError errors={state?.formErrors} />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <SpinnerIcon className="animate-spin" />}
            Continue
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
