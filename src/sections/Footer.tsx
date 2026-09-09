export default function Footer() {
  return (
    <footer className="rw-footer" aria-label="Footer">
      <span>© {new Date().getFullYear()} RooWiki · Technical Artist</span>
      <a className="rw-text-link" href="#top">Back to top ↑</a>
    </footer>
  )
}
