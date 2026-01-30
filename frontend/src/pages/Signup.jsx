import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { api } from '../api/client.js';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const { setAuth } = useAuth();
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);

    try {
      const res = await api.post('/api/auth/signup', { username, email, password });
      setAuth(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Signup failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h1 className="h1">Sign up</h1>

      <form className="form" onSubmit={onSubmit}>
        <input
          className="input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          autoComplete="username"
        />
        <input
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          autoComplete="email"
        />
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="new-password"
        />

        {error ? <p className="error">{error}</p> : null}

        <button className="btn btnPrimary" disabled={busy} type="submit">
          {busy ? 'Creating…' : 'Create account'}
        </button>

        <p className="muted">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
