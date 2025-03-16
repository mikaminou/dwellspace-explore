
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { MapTokenInput } from '../MapTokenInput';
import { MapErrorState } from '../MapStates';

interface MapboxUnavailableProps {
  retryAttempts: number;
  onRetry: () => void;
}

export function MapboxUnavailable({ retryAttempts, onRetry }: MapboxUnavailableProps) {
  return (
    <div className="relative flex-1 w-full flex items-center justify-center">
      <div className="bg-destructive/10 p-6 rounded-md text-destructive max-w-md w-full">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5" />
          <h3 className="font-semibold text-lg">Mapbox Not Available</h3>
        </div>
        <p className="mb-4">We're having trouble loading the map component. This may be due to:</p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Network connectivity issues</li>
          <li>Ad blockers or content filtering</li>
          <li>Browser compatibility problems</li>
        </ul>
        <p className="text-sm text-muted-foreground mb-4">
          Try disabling any ad blockers, checking your internet connection, or using a different browser.
        </p>
        <Button 
          onClick={onRetry}
          variant="default"
          className="w-full"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry Loading Map ({retryAttempts})
        </Button>
      </div>
    </div>
  );
}

interface TokenInputWrapperProps {
  onTokenSet: () => void;
}

export function TokenInputWrapper({ onTokenSet }: TokenInputWrapperProps) {
  return (
    <div className="relative flex-1 w-full flex items-center justify-center">
      <MapTokenInput 
        onTokenSet={onTokenSet}
        isVisible={true}
      />
    </div>
  );
}

interface ErrorStateWrapperProps {
  message: string;
  onRetry: () => void;
}

export function ErrorStateWrapper({ message, onRetry }: ErrorStateWrapperProps) {
  return (
    <div className="relative flex-1 w-full flex items-center justify-center">
      <MapErrorState 
        show={true} 
        message={message || "Unknown error loading map"}
        onRetry={onRetry}
      />
    </div>
  );
}

interface CriticalErrorFallbackProps {
  error: Error | string;
  onRetry: () => void;
}

export function CriticalErrorFallback({ error, onRetry }: CriticalErrorFallbackProps) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  return (
    <div className="relative flex-1 w-full flex items-center justify-center">
      <div className="bg-destructive/10 p-6 rounded-md text-destructive max-w-md w-full">
        <h3 className="font-semibold text-lg mb-2">An error occurred</h3>
        <p className="mb-4">{errorMessage}</p>
        <Button 
          onClick={onRetry} 
          variant="default"
          className="w-full"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reload Page
        </Button>
      </div>
    </div>
  );
}
