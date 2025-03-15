
import React from 'react';
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageToggle({ className }: { className?: string }) {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className={`bg-white/80 dark:bg-secondary/30 hover:bg-white dark:hover:bg-secondary/40 text-secondary dark:text-white font-medium border border-gray-200 dark:border-gray-700 flex items-center gap-1 ${className}`}
      disabled={true}
    >
      <Globe className="h-4 w-4 mr-1" />
      English
    </Button>
  );
}
