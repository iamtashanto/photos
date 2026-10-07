"use client";

import { useState } from "react";
import Link from "next/link";

export function LoginForm() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      setError((await response.json()).error || "Sign in failed.");
      setPending(false);
      return;
    }
    window.location.reload();
  }

  return (
    <main className="admin-auth-shell">
      <section className="admin-auth-card">
        <div className="admin-brand"><span>TA SHANTO</span><small>PHOTOGRAPHY / CMS</small></div>
        <div className="admin-auth-heading"><p className="admin-kicker">Private workspace</p><h1>Welcome back<span>.</span></h1><p>Sign in to manage the photography archive.</p></div>
        <form onSubmit={submit} className="admin-auth-form">
          <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" placeholder="hello@tashanto.com" /></label>
          <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" placeholder="Your password" /></label>
          <button type="submit" disabled={pending}>{pending ? "Signing in…" : "Enter workspace"} <span>↗</span></button>
          {error && <p role="alert">{error}</p>}
        </form>
        <Link className="admin-auth-back" href="/">← Return to portfolio</Link>
      </section>
      <div className="admin-auth-aside"><span>01 / Secure workspace</span><p>One considered place<br />for every frame.</p><small>TA Shanto Photography<br />Content management system</small></div>
    </main>
  );
}
