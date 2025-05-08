import { createContext, useContext, useState } from 'react';
import { clearStoredUser, getStoredUser, storeUser } from '../utils/auth-util';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(getStoredUser());

  const login = (userData: any, remember: boolean) => {
    storeUser(userData, remember);
    setUser(userData);
  };

  const logout = () => {
    clearStoredUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
