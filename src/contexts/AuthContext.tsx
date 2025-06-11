
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'manager@company.com',
    role: 'manager',
    name: 'John Manager'
  },
  {
    id: '2',
    email: 'keeper@company.com',
    role: 'storekeeper',
    name: 'Jane Keeper'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would be an API call
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === 'password123') {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
