import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        © {new Date().getFullYear()} CollabShare
      </div>

      <div className="footer-right">
        <span>Built with ❤️ using MERN</span>
      </div>
    </footer>
  );
}