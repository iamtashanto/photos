import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata("Contact", "Contact Dhaka-based photographer TA Shanto for photography assignments, collaborations and print enquiries.", "/contact");

export default function ContactPage() {
  return <div className="page-shell contact-page"><header className="contact-heading"><p>Get in touch</p><h1>Let’s make<br /><em>something lasting.</em></h1><span>For assignments, collaborations, print enquiries, or simply to say hello.</span></header><div className="contact-layout"><div className="contact-details"><div><small>Email</small><a href="mailto:hello@tashanto.com">hello@tashanto.com</a></div><div><small>Elsewhere</small><a href="https://instagram.com/iamtashanto" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://twitter.com/iamtashanto" target="_blank" rel="noreferrer">Twitter ↗</a><a href="https://facebook.com/iamtashanto" target="_blank" rel="noreferrer">Facebook ↗</a><a href="https://youtube.com/@iamtashanto" target="_blank" rel="noreferrer">YouTube ↗</a><a href="https://linkedin.com/in/iamtashanto" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://tashanto.com" target="_blank" rel="noreferrer">Main portfolio ↗</a></div><p>based in Barishal, Bangladesh.<br />Available for select commissions worldwide.</p></div><ContactForm /></div></div>;
}
