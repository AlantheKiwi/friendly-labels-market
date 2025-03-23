import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
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
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminClientsPage from "./pages/admin/AdminClientsPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminQuotesPage from "./pages/admin/AdminQuotesPage";
import ClientDetailPage from "./pages/admin/ClientDetailPage";
import CookieBanner from "./components/CookieBanner";
import ClientDashboardPage from "./pages/client/ClientDashboardPage";
import ClientOrdersPage from "./pages/client/ClientOrdersPage";
import ClientQueriesPage from "./pages/client/ClientQueriesPage";
import ClientInvoicesPage from "./pages/client/ClientInvoicesPage";
import ClientOffersPage from "./pages/client/ClientOffersPage";
import ClientNotesPage from "./pages/client/ClientNotesPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminCompleteDashboardPage from "./pages/admin/AdminCompleteDashboardPage";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <AuthProvider>
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
                
                {/* Protected Client Routes */}
                <Route path="/client/dashboard" element={
                  <ProtectedRoute requireClient>
                    <ClientDashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="/client/orders" element={
                  <ProtectedRoute requireClient>
                    <ClientOrdersPage />
                  </ProtectedRoute>
                } />
                <Route path="/client/queries" element={
                  <ProtectedRoute requireClient>
                    <ClientQueriesPage />
                  </ProtectedRoute>
                } />
                <Route path="/client/invoices" element={
                  <ProtectedRoute requireClient>
                    <ClientInvoicesPage />
                  </ProtectedRoute>
                } />
                <Route path="/client/offers" element={
                  <ProtectedRoute requireClient>
                    <ClientOffersPage />
                  </ProtectedRoute>
                } />
                <Route path="/client/notes" element={
                  <ProtectedRoute requireClient>
                    <ClientNotesPage />
                  </ProtectedRoute>
                } />
                
                {/* Protected Admin Routes */}
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/complete-dashboard" element={
                  <ProtectedRoute requireAdmin>
                    <AdminCompleteDashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/clients" element={
                  <ProtectedRoute requireAdmin>
                    <AdminClientsPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/orders" element={
                  <ProtectedRoute requireAdmin>
                    <AdminOrdersPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/quotes" element={
                  <ProtectedRoute requireAdmin>
                    <AdminQuotesPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/clients/:id" element={
                  <ProtectedRoute requireAdmin>
                    <ClientDetailPage />
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              <CookieBanner />
            </CartProvider>
          </AuthProvider>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
