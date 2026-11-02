
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import {
  getAuth,
  serverLogin,
  serverLogout,
  setAuth,
} from '../api.js';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
 const [isAuthed, setIsAuthed] = useState(
  () => Boolean(getAuth()?.token)
);

  const login = useCallback(async (username, password) => {
    const name = username.trim();

    const result = await serverLogin(name, password);

    if (!result?.ok || !result.token) {
      return false;
    }

    setAuth({
      username: name,
      token: result.token,
    });

    setIsAuthed(true);

    return true;
  }, []);

  const logout = useCallback(async () => {
    await serverLogout();

    setAuth(null);
    setIsAuthed(false);
  }, []);

  const updateCredentials = useCallback(async () => {
    return false;
  }, []);

  const value = useMemo(
    () => ({
      isAuthed,
      login,
      logout,
      credentials: null,
      updateCredentials,
    }),
    [isAuthed, login, logout, updateCredentials]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }

  return ctx;
};
