import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/layout.css";

export default function Layout({ children }) {
  return (
    <div className="layout">
      <Sidebar />

      <div className="main-content">
        <Navbar />
        <div className="page-content">{children}</div>
        <Footer />
      </div>
    </div>
  );
}