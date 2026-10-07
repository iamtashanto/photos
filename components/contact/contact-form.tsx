"use client";

import { FormEvent, useState } from "react";

type Errors = Partial<Record<"name" | "email" | "subject" | "message", string>>;

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next: Errors = {};
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const subject = String(form.get("subject") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    if (name.length < 2) next.name = "Please tell me your name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (subject.length < 3) next.subject = "Add a short subject.";
    if (message.length < 10) next.message = "A little more detail would be helpful.";
    setErrors(next);
    if (!Object.keys(next).length) window.location.href = `mailto:hello@tashanto.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} <${email}>\n\n${message}`)}`;
  }
  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <label>Name<input name="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby="name-error" />{errors.name && <span id="name-error">{errors.name}</span>}</label>
      <label>Email<input name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby="email-error" />{errors.email && <span id="email-error">{errors.email}</span>}</label>
      <label>Subject<input name="subject" aria-invalid={!!errors.subject} aria-describedby="subject-error" />{errors.subject && <span id="subject-error">{errors.subject}</span>}</label>
      <label>Message<textarea name="message" rows={6} aria-invalid={!!errors.message} aria-describedby="message-error" />{errors.message && <span id="message-error">{errors.message}</span>}</label>
      <button type="submit">Open email draft</button>
      <small>This form opens your email app. No message data is stored.</small>
    </form>
  );
}
