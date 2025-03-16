
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/language/LanguageContext";
import { Suspense, lazy, useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { toast } from "@/components/ui/use-toast";

// Create a new query client instance with better error logging
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      onError: (error) => {
        console.error('Query error:', error);
      }
    },
  },
});

// Regular imports for critical routes
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Lazy loaded routes to improve performance
const Index = lazy(() => import("./pages/Index"));
const Search = lazy(() => import("./pages/Search"));
const Map = lazy(() => import("./pages/Map"));
const PropertyDetails = lazy(() => import("./pages/PropertyDetails"));
const EmailConfirmation = lazy(() => import("./pages/EmailConfirmation"));
const Profile = lazy(() => import("./pages/Profile"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-pulse text-primary font-semibold">Loading...</div>
  </div>
);

// Error boundary for catching rendering errors
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [errorInfo, setErrorInfo] = useState(null);

  useEffect(() => {
    const handleError = (error) => {
      console.error("Global error caught:", error);
      setHasError(true);
      setErrorInfo(error.message || "Unknown error");
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "The application encountered an error. Please refresh the page.",
      });
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <h2 className="text-2xl font-bold text-destructive mb-4">Something went wrong</h2>
        <p className="mb-4">Error: {errorInfo}</p>
        <p className="mb-4">The application encountered an error.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Refresh the page
        </button>
      </div>
    );
  }

  return children;
};

// Add console log to track rendering
console.log("App.tsx - Starting render");

const App = () => {
  console.log("App component rendering");
  
  // Add effect to log mount
  useEffect(() => {
    console.log("App component mounted");
    return () => console.log("App component unmounted");
  }, []);
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LanguageProvider>
            <BrowserRouter>
              <Suspense fallback={<LoadingFallback />}>
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
              </Suspense>
            </BrowserRouter>
          </LanguageProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
