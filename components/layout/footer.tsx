export function Footer() {
  return (
    <footer className="site-footer">
      <div><p className="footer-brand">TA SHANTO</p><p>Photography</p></div>
      <div className="footer-links">
        <a href="mailto:hello@tashanto.com">Email</a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
        <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
        <a href="https://tashanto.com" target="_blank" rel="noreferrer">Portfolio ↗</a>
      </div>
      <div className="footer-place"><p>Based in Bangladesh</p><p>© {new Date().getFullYear()} TA Shanto</p></div>
    </footer>
  );
}
