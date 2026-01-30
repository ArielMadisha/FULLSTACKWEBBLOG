import { Link, useNavigate } from 'react-router-dom';

import { api } from '../api/client.js';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Navbar() {
  const { user, token, clearAuth } = useAuth();
  const navigate = useNavigate();

  async function onLogout() {
    try {
      await api.post('/api/auth/logout');
    } catch {
      // ignore
    }
    clearAuth();
    navigate('/');
  }

  return (
    <header className="nav">
      <div className="navInner">
        <Link className="brand" to="/">
          FullStackWebBlog
        </Link>

        <nav className="navLinks">
          {user ? <span className="badge">Signed in as {user.username}</span> : null}

          <Link className="btn" to="/">
            Home
          </Link>

          {token ? (
            <>
              <Link className="btn btnPrimary" to="/posts/new">
                Create Blog
              </Link>
              <button className="btn" onClick={onLogout} type="button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn" to="/login">
                Login
              </Link>
              <Link className="btn btnPrimary" to="/signup">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
