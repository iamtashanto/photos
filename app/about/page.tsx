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
    <div className="page-shell about-page">
      <header className="about-heading">
        <p>About the photographer</p>
        <h1>
          Looking slowly.<br />
          <em>Keeping honestly.</em>
        </h1>
      </header>

      <div className="about-layout">
        <div className="about-portrait">
          <Image
            src="/profile/tashanto-sample.png"
            alt="TA Shanto, photographer based in Barishal, Bangladesh"
            fill
            preload
            sizes="(max-width: 800px) 100vw, 42vw"
          />
          <small>TA Shanto</small>
        </div>

        <div className="about-copy">
          <p className="lead">
            I&apos;m TA Shanto, a photographer based in Barishal. I photograph the quiet tension between
            people and place—often in available light, often while walking, always with curiosity.
          </p>

          <p>
            My work is drawn to unguarded moments: rain shifting the rhythm of a street, the first
            light across a landscape, a face becoming still between words. I&apos;m less interested
            in perfect scenes than in the feeling that remains after they have passed.
          </p>

          <blockquote>
            Photography is my way of paying attention long enough for the ordinary to become specific.
          </blockquote>

          <h2>Approach</h2>
          <p>
            I work lightly and patiently, with respect for the people and places in front of the
            camera. The aim is not to over-direct life, but to recognise when light, gesture and
            atmosphere begin to tell the same story.
          </p>

          <h2>Selected gear</h2>
          <dl>
            <div>
              <dt>Camera</dt>
              <dd>iPhone 15</dd>
            </div>
            <div>
              <dt>Lenses</dt>
              <dd>26mm main · 13mm ultra wide · 2× telephoto crop</dd>
            </div>
            <div>
              <dt>Based</dt>
              <dd>Barishal, Bangladesh · Available for select assignments</dd>
            </div>
          </dl>

          <p className="developer-note">
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
