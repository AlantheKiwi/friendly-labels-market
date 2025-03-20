
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductsPage from "./pages/ProductsPage";
import ProductPage from "./pages/ProductPage";
import PrintersPage from "./pages/PrintersPage";
import CheckoutPage from "./pages/CheckoutPage";
import ThankYouPage from "./pages/ThankYouPage";
import CustomQuotePage from "./pages/CustomQuotePage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminClientsPage from "./pages/admin/AdminClientsPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminQuotesPage from "./pages/admin/AdminQuotesPage";
import ClientDetailPage from "./pages/admin/ClientDetailPage";
import CookieBanner from "./components/CookieBanner";
import ClientDashboardPage from "./pages/client/ClientDashboardPage";
import ClientOrdersPage from "./pages/client/ClientOrdersPage";
import ClientQueriesPage from "./pages/client/ClientQueriesPage";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <CartProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:slug" element={<ProductPage />} />
                <Route path="/printers" element={<PrintersPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/thank-you" element={<ThankYouPage />} />
                <Route path="/custom-quote" element={<CustomQuotePage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/contact" element={<ContactPage />} />
                
                {/* Auth Routes */}
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/auth/register" element={<RegisterPage />} />
                
                {/* Client Routes */}
                <Route 
                  path="/client/dashboard" 
                  element={
                    <ProtectedRoute requireClient>
                      <ClientDashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/client/orders" 
                  element={
                    <ProtectedRoute requireClient>
                      <ClientOrdersPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/client/queries" 
                  element={
                    <ProtectedRoute requireClient>
                      <ClientQueriesPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/clients" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminClientsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/clients/:clientId" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <ClientDetailPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/orders" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminOrdersPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/quotes" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminQuotesPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <CookieBanner />
            </CartProvider>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
