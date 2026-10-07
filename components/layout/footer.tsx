export function Footer() {
  return (
    <footer className="site-footer">
      <div><p className="footer-brand">TASHANTO</p><p>Photography</p></div>
      <div className="footer-links">
        <a href="mailto:hello@tashanto.com">Email</a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
        <a href="https://tashanto.com" target="_blank" rel="noreferrer">Portfolio ↗</a>
      </div>
      <p>© {new Date().getFullYear()} Md Tanvir Ahamed Shanto</p>
    </footer>
  );
}
