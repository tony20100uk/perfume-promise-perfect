
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (credentials: { identifier: string; password: string }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  { id: '1', name: 'Admin User', role: 'admin' },
  { id: '2', name: 'สมชาย ใจดี', role: 'client', clientId: 'client1' },
  { id: '3', name: 'John Smith', role: 'client', clientId: 'client2' }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials: { identifier: string; password: string }): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock authentication - in real app, this would be API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple mock logic
    if (credentials.identifier === 'admin' && credentials.password === 'admin') {
      setUser(mockUsers[0]);
      setIsLoading(false);
      return true;
    } else if (credentials.identifier === '1234567890123' && credentials.password === 'client1') {
      setUser(mockUsers[1]);
      setIsLoading(false);
      return true;
    } else if (credentials.identifier === 'john@email.com' && credentials.password === 'client2') {
      setUser(mockUsers[2]);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
