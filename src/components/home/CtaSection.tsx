
import React from "react";
import { Link } from "react-router-dom";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language/LanguageContext";

export default function CtaSection() {
  const { t, dir } = useLanguage();

  // Simple error boundary
  try {
    return (
      <section className="py-24 bg-primary/10 dark:bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${dir === 'rtl' ? 'arabic-text' : ''}`}>
            {t('cta.title') || 'Find Your Dream Home Today'}
          </h2>
          <p className={`text-xl text-muted-foreground mb-8 max-w-2xl mx-auto ${dir === 'rtl' ? 'arabic-text' : ''}`}>
            {t('cta.subtitle') || 'Browse our selection of premium properties and connect with top real estate agents.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className={`font-semibold ${dir === 'rtl' ? 'flex-row-reverse arabic-text' : ''}`}
              asChild
            >
              <Link to="/search" className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <SearchIcon className="h-5 w-5" />
                {t('cta.search') || 'Search Properties'}
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className={`font-semibold ${dir === 'rtl' ? 'flex-row-reverse arabic-text' : ''}`}
              asChild
            >
              <Link to="/contact" className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                {t('cta.contact') || 'Contact Us'}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error in CtaSection:", error);
    return (
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Explore Our Properties</h2>
          <Button asChild>
            <Link to="/search">Browse Properties</Link>
          </Button>
        </div>
      </section>
    );
  }
}
