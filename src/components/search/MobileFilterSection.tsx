
import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { Trans } from "@/components/ui/trans";

interface MobileFilterSectionProps {
  section: string;
  activeSection: string | null;
  onToggle: (section: string) => void;
  children: React.ReactNode;
}

export function MobileFilterSection({ 
  section, 
  activeSection, 
  onToggle, 
  children 
}: MobileFilterSectionProps) {
  const { t } = useLanguage();

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button 
        onClick={() => onToggle(section)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium">{t(`search.${section}`)}</span>
        {activeSection === section ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      {activeSection === section && (
        <div className="p-4 bg-gray-50 animate-accordion-down">
          {children}
        </div>
      )}
    </div>
  );
}
