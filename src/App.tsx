
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import PrivateRoute from "@/components/PrivateRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CreateInvoice from "./pages/CreateInvoice";
import Payments from "./pages/Payments";
import PaymentsPage from "./pages/PaymentsPage";
import WalletPage from "./pages/WalletPage";
import InvoicesPage from "./pages/InvoicesPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import InvoiceDetail from "./pages/InvoiceDetail";
import Pricing from "./pages/Pricing";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/pricing" element={<Pricing />} />
            
            {/* Dashboard and its sub-routes */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            
            {/* Redirects for individual pages that now go through the dashboard */}
            <Route path="/invoices" element={
              <PrivateRoute>
                <Navigate to="/dashboard" state={{ tab: "invoices" }} />
              </PrivateRoute>
            } />
            <Route path="/wallet" element={
              <PrivateRoute>
                <Navigate to="/dashboard" state={{ tab: "wallet" }} />
              </PrivateRoute>
            } />
            <Route path="/payments" element={
              <PrivateRoute>
                <Navigate to="/dashboard" state={{ tab: "payments" }} />
              </PrivateRoute>
            } />
            <Route path="/analytics" element={
              <PrivateRoute>
                <Navigate to="/dashboard" state={{ tab: "analytics" }} />
              </PrivateRoute>
            } />
            <Route path="/settings" element={
              <PrivateRoute>
                <Navigate to="/dashboard" state={{ tab: "settings" }} />
              </PrivateRoute>
            } />
            
            {/* Legacy routes */}
            <Route path="/create-invoice" element={
              <PrivateRoute>
                <CreateInvoice />
              </PrivateRoute>
            } />
            <Route path="/invoices/:id" element={
              <PrivateRoute>
                <InvoiceDetail />
              </PrivateRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
