"use client";

import { Check, Link as LinkIcon } from "lucide-react";
import { useState } from "react";

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href);
      } else {
        // Fallback for non-secure contexts or unsupported browsers
        const input = document.createElement("input");
        input.value = window.location.href;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable — silently ignore
    }
  }

  return (
    <button className="share-button" onClick={copy} aria-label={copied ? "Link copied" : "Copy link to this photograph"}>
      {copied ? <Check aria-hidden="true" /> : <LinkIcon aria-hidden="true" />}
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
