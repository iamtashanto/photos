"use client";

import { Check, Download, Link as LinkIcon } from "lucide-react";
import { useState } from "react";

export function ShareButton({ downloadUrl, downloadName }: { downloadUrl: string; downloadName: string }) {
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
    <div className="flex items-center gap-2 max-sm:mt-4">
      <button className="flex items-center gap-2 border border-[var(--line)] bg-transparent px-4 py-3 text-xs transition hover:bg-[var(--text)] hover:text-[var(--bg)]" onClick={copy} aria-label={copied ? "Link copied" : "Copy link to this photograph"}>
        {copied ? <Check aria-hidden="true" /> : <LinkIcon aria-hidden="true" />}
        {copied ? "Copied" : "Copy link"}
      </button>
      <a className="flex items-center gap-2 border border-[var(--line)] bg-transparent px-4 py-3 text-xs transition hover:bg-[var(--text)] hover:text-[var(--bg)]" href={downloadUrl} download={downloadName} aria-label={`Download ${downloadName}`}>
        <Download aria-hidden="true" />
        Download
      </a>
    </div>
  );
}
