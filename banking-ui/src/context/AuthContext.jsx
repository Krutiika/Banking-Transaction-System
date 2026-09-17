import { createContext, useContext, useState, useCallback } from 'react';
import { clearStoredToken, getStoredToken, setStoredToken } from '../services/tokenStorage';

const AuthContext = createContext(null);

function decodeJwtPayload(token) {
  const payload = token.split('.')[1];
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  return JSON.parse(atob(padded));
}

function normalizeUser(source) {
  if (!source) return null;

  const fullName = source.fullName || source.name || source.sub?.split('@')[0] || 'Customer';

  return {
    ...source,
    fullName,
    name: source.name || fullName,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const token = getStoredToken();
      if (!token) return null;

      const payload = decodeJwtPayload(token);
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        clearStoredToken();
        return null;
      }

      return normalizeUser(payload);
    } catch {
      clearStoredToken();
      return null;
    }
  });

  const login = useCallback((token, userData) => {
    setStoredToken(token);
    try {
      if (userData) {
        setUser(normalizeUser(userData));
        return;
      }

      const payload = decodeJwtPayload(token);
      setUser(normalizeUser(payload));
    } catch {
      setUser(normalizeUser(userData) || { token });
    }
  }, []);

  const updateUser = useCallback((nextUser) => {
    setUser((current) => normalizeUser({ ...current, ...nextUser }));
  }, []);

  const logout = useCallback(() => {
    clearStoredToken();
    setUser(null);
  }, []);

  const getToken = useCallback(() => getStoredToken(), []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, getToken, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
