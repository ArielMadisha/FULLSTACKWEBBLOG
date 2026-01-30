import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('fswb_token') || '');
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('fswb_user');
    return raw ? JSON.parse(raw) : null;
  });

  function setAuth(nextToken, nextUser) {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem('fswb_token', nextToken);
    localStorage.setItem('fswb_user', JSON.stringify(nextUser));
  }

  function clearAuth() {
    setToken('');
    setUser(null);
    localStorage.removeItem('fswb_token');
    localStorage.removeItem('fswb_user');
  }

  const value = useMemo(
    () => ({ token, user, setAuth, clearAuth }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
