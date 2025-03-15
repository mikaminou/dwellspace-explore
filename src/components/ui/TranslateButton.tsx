
import { Button } from "@/components/ui/button";

interface TranslateButtonProps {
  originalText: string;
  onTranslated: (translatedText: string) => void;
  className?: string;
}

export function TranslateButton({ originalText, onTranslated, className = "" }: TranslateButtonProps) {
  const handleTranslate = () => {
    // Simply pass back the original text
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
