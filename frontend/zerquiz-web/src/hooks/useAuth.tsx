import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name?: string;
  roles: string[];
  tenantId: string;
  language?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  roles: string[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Login attempt:', { email });
      
      // Direct connection to Identity Service (no gateway yet)
      const response = await fetch('http://localhost:5001/api/Auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Login failed:', errorData);
        throw new Error(errorData.message || 'Login failed');
      }

      const apiResponse = await response.json();
      console.log('✅ API Response:', apiResponse);
      
      // Backend returns: { success: true, data: { accessToken, refreshToken, user: { id, email, roles, ... } } }
      if (!apiResponse.success || !apiResponse.data) {
        console.error('❌ Invalid response format:', apiResponse);
        throw new Error(apiResponse.message || 'Login failed');
      }

      const { accessToken, user: backendUser } = apiResponse.data;
      console.log('👤 User data:', backendUser);
      
      const userData: User = {
        id: backendUser.id,
        email: backendUser.email,
        name: `${backendUser.firstName || ''} ${backendUser.lastName || ''}`.trim(),
        roles: backendUser.roles || [],
        tenantId: backendUser.tenantId || '',
        language: backendUser.language || 'tr'
      };

      setUser(userData);
      setToken(accessToken);
      
      // Persist to localStorage
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userId', backendUser.id);
      if (backendUser.tenantId) {
        localStorage.setItem('tenantId', backendUser.tenantId);
      }
      
      console.log('🎉 Login successful!');
    } catch (error) {
      console.error('💥 Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('tenantId');
  };

  const hasRole = (role: string): boolean => {
    return user?.roles.includes(role) || false;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some(role => user?.roles.includes(role)) || false;
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    roles: user?.roles || [],
    login,
    logout,
    isAuthenticated: !!user && !!token,
    hasRole,
    hasAnyRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

