
"use client"
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '@/lib/axiosinstance';

interface User {
  id: string;
  name: string;
  email: string;
  theme?: 'light' | 'dark';
}

interface UserContextType {
  user: User | null;
  theme: 'light' | 'dark';
  login: (token: string, user: User) => void;
  logout: () => void;
  updateTheme: (newTheme: 'light' | 'dark') => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      // You might want to fetch the user profile from the backend here
      // to ensure the data is up-to-date.
      // For now, we'll just use the token data.
      setUser({ id: decodedToken.id, name: decodedToken.name, email: decodedToken.email, theme: decodedToken.theme });
      if (decodedToken.theme) {
        setTheme(decodedToken.theme);
      }
    }
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    setUser(userData);
    if (userData.theme) {
      setTheme(userData.theme);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setTheme('light'); // Reset to default theme on logout
  };

  const updateTheme = async (newTheme: 'light' | 'dark') => {
    if (!user) return;
    
    // Optimistically update the UI
    setTheme(newTheme);

    try {
      await axiosInstance.patch(`/user/updateTheme/${user.id}`, { theme: newTheme });
      // Update user in context as well
      setUser({ ...user, theme: newTheme });
    } catch (error) {
      console.error("Failed to update theme:", error);
      // Revert theme change on failure
      setTheme(theme); 
    }
  };

  return (
    <UserContext.Provider value={{ user, theme, login, logout, updateTheme }}>
      {children}
    </UserContext.Provider>
  );
};