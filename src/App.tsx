
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/language/LanguageContext";
import { AuthProvider } from "@/contexts/auth";
import { SearchProvider } from "@/contexts/search/SearchContext";
import Index from "./pages/Index";
import Search from "./pages/Search";
import Map from "./pages/Map";
import PropertyDetails from "./pages/PropertyDetails";
import Auth from "./pages/Auth";
import EmailConfirmation from "./pages/EmailConfirmation";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import PropertyCreate from "./pages/PropertyCreate";
import PropertyEdit from "./pages/PropertyEdit";
import NotFound from "./pages/NotFound";
import ProfileCompletion from "./pages/ProfileCompletion";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";

// Create a new query client instance
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <LanguageProvider>
          <SearchProvider>
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={
                  <PublicRoute>
                    <Index />
                  </PublicRoute>
                } />
                <Route path="/search" element={
                  <PublicRoute>
                    <Search />
                  </PublicRoute>
                } />
                <Route path="/map" element={
                  <PublicRoute>
                    <Map />
                  </PublicRoute>
                } />
                <Route path="/property/:id" element={
                  <PublicRoute>
                    <PropertyDetails />
                  </PublicRoute>
                } />
                <Route path="/signin" element={
                  <PublicRoute>
                    <Auth />
                  </PublicRoute>
                } />
                <Route path="/signup" element={
                  <PublicRoute>
                    <Auth />
                  </PublicRoute>
                } />
                <Route path="/auth" element={
                  <PublicRoute>
                    <Auth />
                  </PublicRoute>
                } />
                <Route path="/email-confirmation" element={
                  <PublicRoute>
                    <EmailConfirmation />
                  </PublicRoute>
                } />
                
                {/* Protected routes */}
                <Route path="/profile-completion" element={
                  <ProtectedRoute>
                    <ProfileCompletion />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/property-create" element={
                  <ProtectedRoute>
                    <PropertyCreate />
                  </ProtectedRoute>
                } />
                <Route path="/property/edit/:id" element={
                  <ProtectedRoute>
                    <PropertyEdit />
                  </ProtectedRoute>
                } />
                <Route path="/favorites" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
              <Sonner />
            </BrowserRouter>
          </SearchProvider>
        </LanguageProvider>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
