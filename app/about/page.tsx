import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata(
  "About",
  "Meet TA Shanto, a Dhaka-based Bangladesh photographer focused on honest street, portrait and travel photography.",
  "/about",
);

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[112rem] px-[var(--space-page)] pb-36 pt-[clamp(8rem,14vw,12rem)]">
      <header className="mb-[clamp(5rem,9vw,9rem)] grid grid-cols-[minmax(11rem,1fr)_2fr] gap-8 max-md:grid-cols-1">
        <p className="text-xs uppercase tracking-[.2em] text-[var(--muted)]">About the photographer</p>
        <h1 className="m-0 font-[family-name:var(--serif)] text-[clamp(4rem,7vw,8rem)] leading-[.86] tracking-[-.05em]">
          Looking slowly.<br />
          <em>Keeping honestly.</em>
        </h1>
      </header>

      <div className="grid grid-cols-[minmax(280px,.85fr)_minmax(0,1.15fr)] gap-[clamp(3rem,9vw,10rem)] max-md:grid-cols-1">
        <div className="sticky top-24 h-[min(72vh,48rem)] bg-[var(--panel)] max-md:relative max-md:top-0">
          <Image
            src="/profile/tashanto-sample.png"
            alt="TA Shanto, photographer based in Barishal, Bangladesh"
            fill
            preload
            sizes="(max-width: 800px) 100vw, 42vw"
          />
          <small className="absolute bottom-4 left-4 bg-black/70 px-2 py-1 text-xs text-white">TA Shanto</small>
        </div>

        <div className="space-y-7 text-[1.05rem] leading-relaxed text-[var(--muted)]">
          <p className="font-[family-name:var(--serif)] text-[clamp(2rem,3vw,3.2rem)] leading-tight text-[var(--text)]">
            I&apos;m TA Shanto, a photographer based in Barishal. I photograph the quiet tension between
            people and place—often in available light, often while walking, always with curiosity.
          </p>

          <p>
            My work is drawn to unguarded moments: rain shifting the rhythm of a street, the first
            light across a landscape, a face becoming still between words. I&apos;m less interested
            in perfect scenes than in the feeling that remains after they have passed.
          </p>

          <blockquote className="my-16 border-l border-[var(--line)] pl-8 font-[family-name:var(--serif)] text-[clamp(1.8rem,3vw,3rem)] leading-tight text-[var(--text)]">
            Photography is my way of paying attention long enough for the ordinary to become specific.
          </blockquote>

          <h2 className="pt-8 font-[family-name:var(--serif)] text-3xl text-[var(--text)]">Approach</h2>
          <p>
            I work lightly and patiently, with respect for the people and places in front of the
            camera. The aim is not to over-direct life, but to recognise when light, gesture and
            atmosphere begin to tell the same story.
          </p>

          <h2 className="pt-8 font-[family-name:var(--serif)] text-3xl text-[var(--text)]">Selected gear</h2>
          <dl className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
            <div className="grid grid-cols-[8rem_1fr] py-3">
              <dt>Camera</dt>
              <dd>iPhone 15</dd>
            </div>
            <div className="grid grid-cols-[8rem_1fr] py-3">
              <dt>Lenses</dt>
              <dd>26mm main · 13mm ultra wide · 2× telephoto crop</dd>
            </div>
            <div className="grid grid-cols-[8rem_1fr] py-3">
              <dt>Based</dt>
              <dd>Barishal, Bangladesh · Available for select assignments</dd>
            </div>
          </dl>

          <p className="border-t border-[var(--line)] pt-8 text-sm">
            Away from the camera, I also build software.{" "}
            <Link href="https://tashanto.com" target="_blank" rel="noreferrer">
              Developer portfolio ↗
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
