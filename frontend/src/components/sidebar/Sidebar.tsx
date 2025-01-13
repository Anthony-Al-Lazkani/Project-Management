import { Link } from "react-router-dom";
import "./Sidebar.css";
import { FaHome, FaProjectDiagram, FaTasks, FaCog, FaUser } from "react-icons/fa";  // Import the icons

export const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar-container">
      <nav>
        <div className="sidebar-content">
          <h2 className="sidebar-header-title">Sidebar</h2>

          <ul className="sidebar-links">
            <li>
              <Link to="/" className="sidebar-link">
                <FaHome className="sidebar-icon" /> Dashboard
              </Link>
            </li>

            <li>
              <Link to="/" className="sidebar-link">
                <FaProjectDiagram className="sidebar-icon" /> Projects
              </Link>
            </li>

            <li>
              <Link to="/" className="sidebar-link">
                <FaTasks className="sidebar-icon" /> Tasks
              </Link>
            </li>

            <li>
              <Link to="/" className="sidebar-link">
                <FaCog className="sidebar-icon" /> Settings
              </Link>
            </li>

            <li>
              <Link to="/" className="sidebar-link">
                <FaUser className="sidebar-icon" /> Profile
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
};
