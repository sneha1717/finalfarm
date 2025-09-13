import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface NGO {
  _id: string;
  organizationName: string;
  email: string;
  mobile: string;
  ngoRegistrationId: string;
  details: string;
  focusAreas: string[];
  photo?: {
    url: string;
    publicId: string;
  };
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  socialMedia?: {
    website: string;
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  ngo: NGO | null;
  userType: 'farmer' | 'ngo' | null;
  login: (emailOrUser: string | User | NGO, password?: string, type?: 'farmer' | 'ngo') => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock user data for demo
const mockUser: User = {
  id: '1',
  name: 'രാജേഷ് നായർ', // Rajesh Nair in Malayalam
  email: 'rajesh@example.com',
  phone: '+91 9876543210',
  farmSize: 2.5,
  location: 'Wayanad, Kerala',
  crops: ['Rice', 'Coconut', 'Pepper', 'Cardamom'],
  avatar: '/src/assets/farmer-avatar.jpg'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [ngo, setNgo] = useState<NGO | null>(null);
  const [userType, setUserType] = useState<'farmer' | 'ngo' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const savedUser = localStorage.getItem('krishi-sakhi-user');
    const savedNgo = localStorage.getItem('ngoUser');
    const savedUserType = localStorage.getItem('userType');
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setUserType('farmer');
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('krishi-sakhi-user');
      }
    } else if (savedNgo) {
      try {
        setNgo(JSON.parse(savedNgo));
        setUserType('ngo');
      } catch (error) {
        console.error('Error parsing saved NGO:', error);
        localStorage.removeItem('ngoUser');
        localStorage.removeItem('ngoToken');
      }
    }
    
    if (savedUserType) {
      setUserType(savedUserType as 'farmer' | 'ngo');
    }
    
    setIsLoading(false);
  }, []);

  const login = async (emailOrUser: string | User | NGO, password?: string, type: 'farmer' | 'ngo' = 'farmer'): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      if (type === 'ngo' && typeof emailOrUser === 'object') {
        // NGO login with user object
        setNgo(emailOrUser as NGO);
        setUser(null);
        setUserType('ngo');
        localStorage.setItem('userType', 'ngo');
        setIsLoading(false);
        return true;
      } else if (type === 'farmer' && typeof emailOrUser === 'string' && password) {
        // Farmer login with email/password
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (emailOrUser && password) {
          setUser(mockUser);
          setNgo(null);
          setUserType('farmer');
          localStorage.setItem('krishi-sakhi-user', JSON.stringify(mockUser));
          localStorage.setItem('userType', 'farmer');
          setIsLoading(false);
          return true;
        }
      } else if (typeof emailOrUser === 'object') {
        // Direct user object login
        if ('organizationName' in emailOrUser) {
          setNgo(emailOrUser as NGO);
          setUser(null);
          setUserType('ngo');
          localStorage.setItem('userType', 'ngo');
        } else {
          setUser(emailOrUser as User);
          setNgo(null);
          setUserType('farmer');
          localStorage.setItem('userType', 'farmer');
        }
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setNgo(null);
    setUserType(null);
    localStorage.removeItem('krishi-sakhi-user');
    localStorage.removeItem('ngoUser');
    localStorage.removeItem('ngoToken');
    localStorage.removeItem('userType');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user,
        ngo,
        userType,
        login, 
        logout, 
        isAuthenticated: !!(user || ngo), 
        isLoading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};