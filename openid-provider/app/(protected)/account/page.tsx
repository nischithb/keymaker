"use client";

import { logout } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { SpinnerIcon } from "@phosphor-icons/react";
import { useActionState } from "react";

export default function Page() {
  const [, action, isPending] = useActionState(logout, null);
  return (
    <div>
      <h1>My account</h1>
      <form>
        <Button type="submit" formAction={action}>
          {isPending && <SpinnerIcon className="animate-spin" />}
          Logout
        </Button>
      </form>
    </div>
  );
}
