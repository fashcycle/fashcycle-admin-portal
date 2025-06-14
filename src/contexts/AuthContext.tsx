import React, { createContext, useContext, useState, ReactNode } from 'react';
import { STORAGE } from '../services/localVariables';
import addDeleteGetLocalStorage from '../services/addDeleteGetLocalStorage';

interface User {
  email: string;
  name: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setAuthDetails: (user: User, token: string) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = addDeleteGetLocalStorage(STORAGE.USER_DETAILS, null, "get", "single");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    const savedToken = addDeleteGetLocalStorage(STORAGE.USER_TOKEN, null, "get", "single");
    return savedToken ? savedToken : null;
  });

  const setAuthDetails = (user: any, token: string) => {
    setUser(user);
    setToken(token);
    addDeleteGetLocalStorage(STORAGE.USER_DETAILS, user, "add", "single");
    addDeleteGetLocalStorage(STORAGE.USER_TOKEN, token, "add", "single");
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    if (email === 'admin@example.com' && password === 'password') {
      const userData = {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin'
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  };


  const logout = () => {
    setUser(null);
    addDeleteGetLocalStorage(STORAGE.USER_DETAILS, null, "delete", "single");
    addDeleteGetLocalStorage(STORAGE.USER_TOKEN, null, "delete", "single");
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      setAuthDetails,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};