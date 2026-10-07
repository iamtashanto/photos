import Link from "next/link";

export default function NotFound() { return <div className="not-found"><p>404 / Exposed frame</p><h1>Frame not found.</h1><span>This moment may have passed, or perhaps it never existed.</span><Link href="/gallery">Return to the gallery</Link></div>; }
