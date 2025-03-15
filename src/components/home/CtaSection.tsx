
import React from "react";
import { Link } from "react-router-dom";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language/LanguageContext";

export default function CtaSection() {
  const { t, dir } = useLanguage();

  return (
    <section className="py-24 bg-primary/10 dark:bg-primary/5">
      <div className="container mx-auto px-4 text-center">
        <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${dir === 'rtl' ? 'arabic-text' : ''}`}>
          {t('cta.title')}
        </h2>
        <p className={`text-xl text-muted-foreground mb-8 max-w-2xl mx-auto ${dir === 'rtl' ? 'arabic-text' : ''}`}>
          {t('cta.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="xl" 
            variant="cta"
            className={`font-semibold ${dir === 'rtl' ? 'flex-row-reverse arabic-text' : ''}`}
            asChild
          >
            <Link to="/search" className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <SearchIcon className="h-5 w-5" />
              {t('cta.search')}
            </Link>
          </Button>
          <Button 
            size="xl" 
            variant="secondary" 
            className={`font-semibold ${dir === 'rtl' ? 'flex-row-reverse arabic-text' : ''}`}
            asChild
          >
            <Link to="/contact" className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              {t('cta.contact')}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
