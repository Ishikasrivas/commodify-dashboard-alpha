import i18n from 'i18next';
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
  X,
  Loader2,
  Languages
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const Layout: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout, loading } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">{t('common.loading')}</span>
      </div>
    );
  }

  const menuItems = [
    {
      label: t('dashboard.title'),
      icon: BarChart3,
      path: '/dashboard',
      roles: ['manager']
    },
    {
      label: t('viewProducts'),
      icon: Package,
      path: '/products',
      roles: ['manager', 'storekeeper']
    },
    {
      label: t('addProduct.title'),
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
                {t('appTitle')}
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
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              {/* Language Switcher */}
              <div className="flex items-center gap-1 border rounded-md p-1">
                <Languages className="h-4 w-4 text-muted-foreground" />
                <Button 
                  variant={i18n.language === 'en' ? "default" : "ghost"} 
                  size="sm" 
                  onClick={() => i18n.changeLanguage('en')}
                  className="h-7 px-2 text-xs"
                >
                  EN
                </Button>
                <Button 
                  variant={i18n.language === 'hi' ? "default" : "ghost"} 
                  size="sm" 
                  onClick={() => i18n.changeLanguage('hi')}
                  className="h-7 px-2 text-xs"
                >
                  हिंदी
                </Button>
              </div>

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
                <span className="hidden sm:inline">{t('logout')}</span>
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
      <main>
        <Outlet />
      </main>
    </div>
  );
};
