import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  // Student
  studentUser: User | null;
  isStudentLoggedIn: boolean;
  loginStudent: (fullName: string, enrollment: string, phone?: string, email?: string) => Promise<User>;
  logoutStudent: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;

  // Admin
  isAdminLoggedIn: boolean;
  loginAdmin: (password: string) => Promise<boolean>;
  logoutAdmin: () => void;

  // Toast
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [studentUser, setStudentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('rp_student_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('rp_admin_token'));
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const loginStudent = async (
    fullName: string,
    enrollment: string,
    phone?: string,
    email?: string
  ): Promise<User> => {
    try {
      const res = await api.studentLogin({
        fullName,
        icfaiEnrollmentNumber: enrollment,
        phone,
        email,
      });
      setStudentUser(res.user);
      localStorage.setItem('rp_student_user', JSON.stringify(res.user));
      localStorage.setItem('rp_student_token', res.token);
      showToast(`Welcome back, ${res.user.fullName}!`, 'success');
      return res.user;
    } catch (err: any) {
      showToast(err.message || 'Student login failed', 'error');
      throw err;
    }
  };

  const logoutStudent = () => {
    setStudentUser(null);
    localStorage.removeItem('rp_student_user');
    localStorage.removeItem('rp_student_token');
    showToast('Signed out of student session', 'info');
  };

  const loginAdmin = async (password: string): Promise<boolean> => {
    try {
      const res = await api.adminLogin(password);
      if (res.token) {
        localStorage.setItem('rp_admin_token', res.token);
        setIsAdminLoggedIn(true);
        showToast('Admin operational access granted', 'success');
        return true;
      }
      return false;
    } catch (err: any) {
      showToast(err.message || 'Invalid administrator password', 'error');
      throw err;
    }
  };

  const logoutAdmin = async () => {
    try {
      await api.adminLogout();
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('rp_admin_token');
    setIsAdminLoggedIn(false);
    showToast('Logged out of Admin Portal', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        studentUser,
        isStudentLoggedIn: Boolean(studentUser),
        loginStudent,
        logoutStudent,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        toast,
        showToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
