
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TranslateButtonProps {
  originalText: string;
  onTranslated: (translatedText: string) => void;
  className?: string;
}

export function TranslateButton({ originalText, onTranslated, className = "" }: TranslateButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const handleTranslate = async () => {
    if (!originalText || isLoading) return;
    
    setIsLoading(true);
    
    try {
      // For now, let's simulate the AI translation with a delay
      // In a real implementation, this would be an API call to a translation service
      setTimeout(() => {
        // This is a mock implementation
        // In a real app, you would call an AI translation API here
        
        // Simple mock translations based on the target language
        let translatedText = originalText;
        
        if (language === 'ar') {
          // Arabic mock translation logic (simple example)
          if (originalText.includes("Modern Apartment")) {
            translatedText = "شقة عصرية في حيدرة";
          } else if (originalText.includes("beautiful")) {
            translatedText = originalText.replace("beautiful", "جميلة");
          } else if (originalText.includes("Hydra")) {
            translatedText = originalText.replace("Hydra", "حيدرة");
          }
        } else if (language === 'fr') {
          // French mock translation logic
          if (originalText.includes("Modern Apartment")) {
            translatedText = "Appartement Moderne à Hydra";
          } else if (originalText.includes("beautiful")) {
            translatedText = originalText.replace("beautiful", "beau");
          }
        }
        
        onTranslated(translatedText);
        setIsLoading(false);
        
        toast({
          title: t('translate.success'),
          description: t('translate.success'),
        });
      }, 1000);
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: t('translate.error'),
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleTranslate} 
      disabled={isLoading}
      className={`text-xs text-muted-foreground hover:text-primary ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          {t('translate.loading')}
        </>
      ) : (
        t('translate.button')
      )}
    </Button>
  );
}
