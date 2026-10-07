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
    <main className="admin-auth-shell grid min-h-svh grid-cols-[1fr_360px] bg-[#f3f1eb] text-[#171716] max-md:grid-cols-1">
      <section className="w-full max-w-xl self-center justify-self-end px-[clamp(2rem,8vw,8rem)] py-16">
        <div className="text-base font-bold tracking-[.18em]"><span>TA SHANTO</span><small className="mt-2 block text-[.66rem] tracking-[.16em] text-stone-500">PHOTOGRAPHY / CMS</small></div>
        <div className="my-16"><p className="text-xs uppercase tracking-[.14em] text-stone-500">Private workspace</p><h1 className="my-3 font-[family-name:var(--serif)] text-[clamp(3.5rem,7vw,6.5rem)] leading-[.86]">Welcome back<span className="text-rose-500">.</span></h1><p className="text-sm text-stone-500">Sign in to manage the photography archive.</p></div>
        <form onSubmit={submit} className="grid gap-5 [&_input]:mt-2 [&_input]:w-full [&_input]:border [&_input]:border-stone-300 [&_input]:bg-white [&_input]:px-4 [&_input]:py-3 [&_label]:text-xs [&_label]:uppercase [&_label]:tracking-widest [&_label]:text-stone-500">
          <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" placeholder="hello@tashanto.com" /></label>
          <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" placeholder="Your password" /></label>
          <button className="flex justify-between bg-[#171716] px-5 py-4 text-xs uppercase tracking-widest text-white" type="submit" disabled={pending}>{pending ? "Signing in…" : "Enter workspace"} <span>↗</span></button>
          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        </form>
        <Link className="mt-8 inline-block text-sm text-stone-500" href="/">← Return to portfolio</Link>
      </section>
      <div className="flex flex-col justify-between border-l border-stone-300 bg-[#171716] p-8 text-white max-md:hidden"><span className="text-xs uppercase tracking-widest text-white/50">01 / Secure workspace</span><p className="my-auto font-[family-name:var(--serif)] text-4xl leading-none">One considered place<br />for every frame.</p><small className="text-white/50">TA Shanto Photography<br />Content management system</small></div>
    </main>
  );
}
