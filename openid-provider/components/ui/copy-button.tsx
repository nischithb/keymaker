"use client";

import { useState } from "react";
import { Button } from "./button";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";

export default function CopyButton({ text }: { text: string }) {
  const [showCopied, setShowCopied] = useState(false);

  async function handleCopy() {
    setShowCopied(true);
    await navigator.clipboard.writeText(text);
    setTimeout(() => setShowCopied(false), 2000);
  }

  return (
    <Button size="icon" variant="ghost" onClick={handleCopy}>
      {showCopied ? <CheckIcon className="text-green-500" /> : <CopyIcon />}
    </Button>
  );
}
