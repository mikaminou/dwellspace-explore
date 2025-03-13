
import React from 'react';
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language/LanguageContext";

export function LanguageToggle({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'ar' : 'fr');
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={toggleLanguage} 
      className={`bg-white/80 hover:bg-white text-primary font-medium border border-primary/20 ${className}`}
    >
      {language === 'fr' ? 'العربية' : 'Français'}
    </Button>
  );
}
