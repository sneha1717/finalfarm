import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Weather from "./pages/Weather";
import Community from "./pages/Community";
import Crops from "./pages/Crops";
import Market from "./pages/Market";
import NGO from "./pages/NGO";
import GoGreen from "./pages/GoGreen";
import NewsEvents from "./pages/NewsEvents";
import Fundraiser from "./pages/Fundraiser";
import NotificationDetails from "./pages/NotificationDetails";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import NGOLogin from "./pages/NGOLogin";
import NGODashboard from './pages/NGODashboard';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background text-foreground">
              <Header />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/weather" element={<Weather />} />
                <Route path="/community" element={<Community />} />
                <Route path="/crops" element={<Crops />} />
                <Route path="/market" element={<Market />} />
                <Route path="/ngo" element={<NGO />} />
                <Route path="/ngo-login" element={<NGOLogin />} />
                <Route path="/ngo-dashboard" element={<NGODashboard />} />
                <Route path="/go-green" element={<GoGreen />} />
                <Route path="/news-events" element={<NewsEvents />} />
                <Route path="/fundraiser" element={<Fundraiser />} />
                <Route path="/notifications" element={<NotificationDetails />} />
                <Route path="/profile" element={<Profile />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
