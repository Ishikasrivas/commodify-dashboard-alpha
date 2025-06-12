export type UserRole = 'manager' | 'storekeeper';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  supplier: string;
  description: string;
  created_at: string;
  updated_at: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

export interface AuthContextType {
  user: User | null;
  session: any;
  login: (email: string, password: string) => Promise<{ error?: any }>;
  loginWithGoogle: () => Promise<{ error?: any }>;
  signup: (email: string, password: string, name: string) => Promise<{ error?: any }>;
  updateUserRole: (role: UserRole) => Promise<{ error?: any }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}
