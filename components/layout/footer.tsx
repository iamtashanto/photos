export function Footer() {
  return (
    <footer className="site-footer">
      <div><p className="footer-brand">TA SHANTO</p><p>Photography</p></div>
      <div className="footer-links">
        <a href="mailto:hello@tashanto.com">Email</a>
        <a href="https://instagram.com/iamtashanto" target="_blank" rel="noreferrer">Instagram</a>
        <a href="https://twitter.com/iamtashanto" target="_blank" rel="noreferrer">Twitter</a>
        <a href="https://facebook.com/iamtashanto" target="_blank" rel="noreferrer">Facebook</a>
        <a href="https://youtube.com/@iamtashanto" target="_blank" rel="noreferrer">YouTube</a>
        <a href="https://linkedin.com/in/iamtashanto" target="_blank" rel="noreferrer">LinkedIn</a>
        <a href="https://tashanto.com" target="_blank" rel="noreferrer">Portfolio ↗</a>
      </div>
      <div className="footer-place"><p>Based in Bangladesh</p><p>© {new Date().getFullYear()} TA Shanto</p></div>
    </footer>
  );
}
