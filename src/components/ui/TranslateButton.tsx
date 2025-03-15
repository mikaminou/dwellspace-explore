
import { Button } from "@/components/ui/button";

interface TranslateButtonProps {
  originalText: string;
  onTranslated: (translatedText: string) => void;
  className?: string;
}

export function TranslateButton({ originalText, onTranslated, className = "" }: TranslateButtonProps) {
  // Simplified placeholder without translation UI
  return null;
}
