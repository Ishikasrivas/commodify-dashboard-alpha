
export interface User {
  id: string;
  email: string;
  role: 'manager' | 'storekeeper';
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
  lastUpdated: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}
