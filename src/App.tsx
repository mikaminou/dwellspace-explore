
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/language/LanguageContext";
import Index from "./pages/Index";
import Search from "./pages/Search";
import Map from "./pages/Map";
import PropertyDetails from "./pages/PropertyDetails";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import EmailConfirmation from "./pages/EmailConfirmation";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import PropertyCreate from "./pages/PropertyCreate";
import PropertyEdit from "./pages/PropertyEdit";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Create a new query client instance
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<Search />} />
            <Route path="/map" element={<Map />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/email-confirmation" element={<EmailConfirmation />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/property/create" 
              element={
                <ProtectedRoute>
                  <PropertyCreate />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/property/edit/:id" 
              element={
                <ProtectedRoute>
                  <PropertyEdit />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/favorites" 
              element={
                <ProtectedRoute>
                  <NotFound />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
