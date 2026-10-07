"use client";

import { useState } from "react";

export function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      setError((await response.json()).error || "Sign in failed.");
      setPending(false);
      return;
    }
    window.location.reload();
  }

  return (
    <main className="page-shell" style={{ maxWidth: 520 }}>
      <header className="page-intro">
        <p>Private area</p>
        <h1>Admin</h1>
        <span>Sign in to manage the photography archive.</span>
      </header>
      <form onSubmit={submit} className="contact-form">
        <label>
          Password
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" />
        </label>
        <button type="submit" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
        {error && <p role="alert">{error}</p>}
      </form>
    </main>
  );
}
