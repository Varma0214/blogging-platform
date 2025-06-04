import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="logo">Blog Platform</Link>
        <div className="nav-links">
          <Link to="/admin/login" className="admin-link">Login</Link>
          <Link to="/admin/signup" className="admin-link">Signup</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;