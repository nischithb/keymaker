"use client";

import { cn } from "@/lib/utils";
import { Input } from "./input";
import { useState } from "react";
import { Button } from "./button";
import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";

export default function PasswordInput({
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "type">) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        className={cn("pr-8", className)}
        {...props}
      />
      <Button
        size="icon"
        variant="link"
        className="absolute right-0 cursor-pointer"
        onClick={() => setShow((prevShow) => !prevShow)}
      >
        {show ? <EyeSlashIcon /> : <EyeIcon />}
      </Button>
    </div>
  );
}
