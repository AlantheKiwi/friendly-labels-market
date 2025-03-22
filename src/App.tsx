
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
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
import ClientInvoicesPage from "./pages/client/ClientInvoicesPage";
import ClientOffersPage from "./pages/client/ClientOffersPage";
import ClientNotesPage from "./pages/client/ClientNotesPage";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
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
              
              {/* Client Routes (no longer protected) */}
              <Route path="/client/dashboard" element={<ClientDashboardPage />} />
              <Route path="/client/orders" element={<ClientOrdersPage />} />
              <Route path="/client/queries" element={<ClientQueriesPage />} />
              <Route path="/client/invoices" element={<ClientInvoicesPage />} />
              <Route path="/client/offers" element={<ClientOffersPage />} />
              <Route path="/client/notes" element={<ClientNotesPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/clients" element={<AdminClientsPage />} />
              <Route path="/admin/orders" element={<AdminOrdersPage />} />
              <Route path="/admin/quotes" element={<AdminQuotesPage />} />
              <Route path="/admin/clients/:id" element={<ClientDetailPage />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            <CookieBanner />
          </CartProvider>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
