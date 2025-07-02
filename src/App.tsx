import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import Login from './pages/Login';
import { RoleSelection } from "./pages/RoleSelection";
import Dashboard from "./pages/Dashboard";
import Products from './pages/Products';
import EditProduct from './pages/EditProduct';
import { AddProduct } from "./pages/AddProduct";
import NotFound from "./pages/NotFound";
import { useTranslation } from 'react-i18next';
import './i18n';

const queryClient = new QueryClient();

const App = () => {
  const { t, i18n } = useTranslation();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <div className="p-4 flex gap-2 items-center">
              <span>{t("selectLanguage")}:</span>
              <button onClick={() => i18n.changeLanguage("en")} className="px-2 py-1 border rounded">EN</button>
              <button onClick={() => i18n.changeLanguage("hi")} className="px-2 py-1 border rounded">हिंदी</button>
            </div>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/role-selection" element={<RoleSelection />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Protected Routes */}
                <Route element={<Layout />}>
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute requiredRole="manager">
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/products"
                    element={
                      <ProtectedRoute>
                        <Products />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/products/add"
                    element={
                      <ProtectedRoute>
                        <AddProduct />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/products/edit/:id"
                    element={
                      <ProtectedRoute>
                        <AddProduct />
                      </ProtectedRoute>
                    }
                  />
                </Route>
                <Route path="/products/edit/:id" element={<EditProduct />} />

                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
