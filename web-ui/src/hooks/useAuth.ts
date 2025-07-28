import { useState, useEffect } from 'react';
import { User } from '../types/user';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('xpensify_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('xpensify_users') || '[]');
    const user = users.find((u: User) => u.email === email && u.password === password);
    
    if (user) {
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;
      setUser(userWithoutPassword);
      localStorage.setItem('xpensify_user', JSON.stringify(userWithoutPassword));
      window.location.reload();
      return true;

    }
    return false;
  };

  const register = (email: string, password: string, firstName: string, lastName: string): boolean => {
    const users = JSON.parse(localStorage.getItem('xpensify_users') || '[]');
    
    if (users.find((u: User) => u.email === email)) {
      return false; // User already exists
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      password,
      account: {
        id: crypto.randomUUID(),
        userId: crypto.randomUUID(),
        firstName,
        middleName: '',
        lastName,
        dateOfBirth: '',
        gender: 'Unknown' as any,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString()
      }
    };

    users.push(newUser);
    localStorage.setItem('xpensify_users', JSON.stringify(users));
    
    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;
    setUser(userWithoutPassword);
    localStorage.setItem('xpensify_user', JSON.stringify(userWithoutPassword));
    window.location.reload();
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('xpensify_user');
    window.location.reload();
  };

  return { user, login, register, logout, loading };
};