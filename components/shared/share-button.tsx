"use client";

import { Check, Link as LinkIcon } from "lucide-react";
import { useState } from "react";

export function ShareButton() {
  const [copied, setCopied] = useState(false);
  return <button className="share-button" onClick={async () => { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1800); }}>{copied ? <Check /> : <LinkIcon />}{copied ? "Copied" : "Copy link"}</button>;
}
