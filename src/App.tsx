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
import './i18n';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/role-selection" element={<RoleSelection />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Protected Routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/add" element={<AddProduct />} />
                  <Route path="/products/edit/:id" element={<EditProduct />} />
                </Route>

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
