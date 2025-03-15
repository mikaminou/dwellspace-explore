
import { Button } from "@/components/ui/button";

interface TranslateButtonProps {
  originalText: string;
  onTranslated: (translatedText: string) => void;
  className?: string;
}

export function TranslateButton({ originalText, onTranslated, className = "" }: TranslateButtonProps) {
  const handleTranslate = () => {
    // This is a placeholder for actual translation logic
    // In a real implementation, you would call a translation API
    console.log("Translation requested for:", originalText);
    
    // For now, just pass back the original text
    onTranslated(originalText);
  };

  return (
    <Button 
      onClick={handleTranslate} 
      variant="outline" 
      size="sm" 
      className={`text-xs ${className}`}
    >
      Translate
    </Button>
  );
}
