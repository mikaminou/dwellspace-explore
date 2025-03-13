
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`bg-white/80 hover:bg-white text-primary font-medium border border-primary/20 flex items-center gap-1 ${className}`}
        >
          <Globe className="h-4 w-4" />
          {getLanguageLabel(language)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={dir === 'rtl' ? 'start' : 'end'} className="min-w-32">
        <DropdownMenuItem onClick={() => setLanguage('en')}>
          <span className="mr-2">🇬🇧</span> English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('fr')}>
          <span className="mr-2">🇫🇷</span> Français
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('ar')}>
          <span className="mr-2">🇩🇿</span> العربية
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
