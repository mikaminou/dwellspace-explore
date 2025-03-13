
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
      className={className}
    >
      {language === 'fr' ? 'العربية' : 'Français'}
    </Button>
  );
}
