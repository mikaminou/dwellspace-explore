
import React from 'react';
import { Loader2, MapPin, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface LoadingStateProps {
  show: boolean;
}

export function MapLoadingState({ show }: LoadingStateProps) {
  const { t } = useLanguage();
  
  if (!show) return null;
  
  return (
    <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-medium">{t('map.loading')}</p>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  show: boolean;
}

export function MapEmptyState({ show }: EmptyStateProps) {
  const { t } = useLanguage();
  
  if (!show) return null;
  
  return (
    <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
      <div className="flex flex-col items-center space-y-4 max-w-md text-center px-4">
        <MapPin className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-xl font-medium">{t('map.noProperties')}</h3>
        <p className="text-muted-foreground">{t('search.tryAdjustingFilters')}</p>
      </div>
    </div>
  );
}

interface ErrorStateProps {
  show: boolean;
  message: string;
  onRetry?: () => void;
}

export function MapErrorState({ show, message, onRetry }: ErrorStateProps) {
  if (!show) return null;
  
  return (
    <div className="absolute inset-0 bg-background/90 flex items-center justify-center z-10">
      <div className="flex flex-col items-center space-y-4 max-w-md text-center px-6 py-8 bg-background rounded-lg shadow-lg">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h3 className="text-xl font-medium">Map Loading Error</h3>
        <p className="text-muted-foreground">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} className="mt-2">
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}
