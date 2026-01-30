import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { api } from '../api/client.js';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Login() {
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
      const res = await api.post('/api/auth/login', { email, password });
      setAuth(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h1 className="h1">Login</h1>

      <form className="form" onSubmit={onSubmit}>
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
          autoComplete="current-password"
        />

        {error ? <p className="error">{error}</p> : null}

        <button className="btn btnPrimary" disabled={busy} type="submit">
          {busy ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="muted">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
