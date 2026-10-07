export function Footer() {
  return (
    <footer className="grid grid-cols-[1fr_2fr_1fr] gap-8 border-t border-[var(--line)] px-[var(--space-page)] py-12 text-sm text-[var(--muted)] max-sm:grid-cols-1">
      <div><p className="m-0 text-base tracking-[.2em] text-[var(--text)]">TA SHANTO</p><p className="m-0">Photography</p></div>
      <div className="flex flex-wrap justify-center gap-6 max-sm:justify-start">
        <a href="mailto:hello@tashanto.com">Email</a>
        <a href="https://instagram.com/iamtashanto" target="_blank" rel="noreferrer">Instagram</a>
        <a href="https://twitter.com/iamtashanto" target="_blank" rel="noreferrer">Twitter</a>
        <a href="https://facebook.com/iamtashanto" target="_blank" rel="noreferrer">Facebook</a>
        <a href="https://youtube.com/@iamtashanto" target="_blank" rel="noreferrer">YouTube</a>
        <a href="https://linkedin.com/in/iamtashanto" target="_blank" rel="noreferrer">LinkedIn</a>
        <a href="https://tashanto.com" target="_blank" rel="noreferrer">Portfolio ↗</a>
      </div>
      <div className="text-right max-sm:text-left"><p className="m-0">Based in Bangladesh</p><p className="m-0">© {new Date().getFullYear()} TA Shanto</p></div>
    </footer>
  );
}
