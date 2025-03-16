
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/language/LanguageContext";
import { Suspense, lazy, useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { toast } from "@/components/ui/use-toast";

// Log initialization
console.log("App.tsx - Starting initialization");

// Create a query client with error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Regular imports for critical routes
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Basic loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-pulse text-primary font-semibold">Loading...</div>
  </div>
);

// Load components with safety wrappers
console.log("App.tsx - Setting up lazy imports");
const Index = lazy(() => import("./pages/Index").catch(() => ({ default: () => <NotFound /> })));
const Search = lazy(() => import("./pages/Search").catch(() => ({ default: () => <NotFound /> })));
const Map = lazy(() => import("./pages/Map").catch(() => ({ default: () => <NotFound /> })));
const PropertyDetails = lazy(() => import("./pages/PropertyDetails").catch(() => ({ default: () => <NotFound /> })));
const EmailConfirmation = lazy(() => import("./pages/EmailConfirmation").catch(() => ({ default: () => <NotFound /> })));
const Profile = lazy(() => import("./pages/Profile").catch(() => ({ default: () => <NotFound /> })));

// Error boundary component
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [errorInfo, setErrorInfo] = useState(null);

  useEffect(() => {
    const handleError = (error) => {
      console.error("Error caught in boundary:", error);
      setHasError(true);
      setErrorInfo(error.message || "Unknown error");
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <h2 className="text-2xl font-bold text-destructive mb-4">Something went wrong</h2>
        <p className="mb-4">Error: {errorInfo}</p>
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

// App component with error handling
const App = () => {
  console.log("App component rendering");
  
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
