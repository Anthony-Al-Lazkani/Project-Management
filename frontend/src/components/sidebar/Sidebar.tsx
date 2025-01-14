import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import {
  FaHome,
  FaProjectDiagram,
  FaTasks,
  FaCog,
  FaUser,
  FaUserPlus,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { CgLogIn } from "react-icons/cg";

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  function handleLogout() {
    logout();
    navigate("/login");
  }
  return (
    <aside className="sidebar-container">
      <nav>
        <div className="sidebar-content">
          <h2 className="sidebar-header-title">Sidebar</h2>

          <ul className="sidebar-links">
            {isAuthenticated ? (
              <>
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

                <li>
                  <div className="sidebar-link" onClick={handleLogout}>
                    <FaSignOutAlt className="sidebar-icon" /> Logout
                  </div>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="sidebar-link">
                    <CgLogIn className="sidebar-icon" /> Login
                  </Link>
                </li>

                <li>
                  <Link to="/register" className="sidebar-link">
                    <FaUserPlus className="sidebar-icon" /> Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </aside>
  );
};
