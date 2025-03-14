
import React from 'react';
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

export function LanguageToggle({ className }: { className?: string }) {
  const { language, setLanguage, t, dir } = useLanguage();

  const getLanguageLabel = (code: string) => {
    switch(code) {
      case 'ar': return 'العربية';
      case 'fr': return 'Français';
      case 'en': return 'English';
      default: return code;
    }
  };

  const getLanguageFlag = (code: string) => {
    switch(code) {
      case 'ar': return '🇩🇿';
      case 'fr': return '🇫🇷';
      case 'en': return '🇬🇧';
      default: return '🌐';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`bg-white/80 dark:bg-secondary/30 hover:bg-white dark:hover:bg-secondary/40 text-secondary dark:text-white font-medium border border-gray-200 dark:border-gray-700 flex items-center gap-1 ${className}`}
        >
          <Globe className="h-4 w-4 mr-1" />
          {getLanguageLabel(language)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={dir === 'rtl' ? 'start' : 'end'} className="min-w-32">
        <DropdownMenuItem onClick={() => setLanguage('en')} className="hover:bg-muted cursor-pointer">
          <span className="mr-2" role="img" aria-label="GB flag">{getLanguageFlag('en')}</span> English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('fr')} className="hover:bg-muted cursor-pointer">
          <span className="mr-2" role="img" aria-label="FR flag">{getLanguageFlag('fr')}</span> Français
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('ar')} className="hover:bg-muted cursor-pointer">
          <span className="mr-2" role="img" aria-label="DZ flag">{getLanguageFlag('ar')}</span> العربية
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
