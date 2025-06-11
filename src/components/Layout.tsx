
import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Package, 
  Plus, 
  LogOut, 
  Sun, 
  Moon,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      label: 'Dashboard',
      icon: BarChart3,
      path: '/dashboard',
      roles: ['manager']
    },
    {
      label: 'View Products',
      icon: Package,
      path: '/products',
      roles: ['manager', 'storekeeper']
    },
    {
      label: 'Add Product',
      icon: Plus,
      path: '/products/add',
      roles: ['manager', 'storekeeper']
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Mobile Menu Button */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden mr-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <h1 className="text-xl font-bold text-foreground">
                Commodities Management
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {filteredMenuItems.map((item) => (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className="flex items-center gap-2"
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </nav>

            {/* User Info and Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              
              <div className="hidden sm:block text-sm text-muted-foreground">
                {user?.name} ({user?.role})
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <nav className="space-y-2">
                {filteredMenuItems.map((item) => (
                  <Button
                    key={item.path}
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className="w-full justify-start flex items-center gap-2"
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};
