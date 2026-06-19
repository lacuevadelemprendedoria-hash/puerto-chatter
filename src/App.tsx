import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GuestChat from "./pages/GuestChat";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTestChat from "./pages/AdminTestChat";
import NotFound from "./pages/NotFound";
import { ErrorBoundary } from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const CreditFooter = () => (
  <footer className="shrink-0 bg-background px-4 py-6 text-center">
    <a
      href="https://dgestudio.app"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex rounded-sm font-heading text-base font-semibold text-primary transition-colors hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      Creado por DG Studio
    </a>
  </footer>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex min-h-screen flex-col bg-background">
            <div className="min-h-0 flex-1">
              <Routes>
                <Route path="/" element={<ErrorBoundary><GuestChat /></ErrorBoundary>} />
                <Route path="/admin" element={<ErrorBoundary><AdminLogin /></ErrorBoundary>} />
                <Route path="/admin/dashboard" element={<ErrorBoundary><AdminDashboard /></ErrorBoundary>} />
                <Route path="/admin/test-chat" element={<ErrorBoundary><AdminTestChat /></ErrorBoundary>} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <CreditFooter />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
