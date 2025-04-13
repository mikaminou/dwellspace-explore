import React, { useEffect, useState } from 'react';
import { useLanguage } from "@/contexts/language/LanguageContext";
import { Button } from "@/components/ui/button";
import { StarIcon, ArrowRightIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HeroSearch } from "@/components/index/HeroSearch";
import { VideoBackground } from "@/components/index/VideoBackground";


export const HeroSection: React.FC = () => {
  const { t, dir } = useLanguage();
  const navigate = useNavigate();

  const handleSearchSubmit = (searchParams: string) => {
    navigate(`/search${searchParams}`);
  };


  return (
    <section className="relative h-[80vh] flex items-center justify-center bg-secondary/90">
      <VideoBackground/>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className={`text-5xl md:text-6xl font-bold mb-4 text-white text-center ${dir === 'rtl' ? 'arabic-text' : ''}`}>
          {t('hero.title')}
        </h1>
        <p className={`text-xl text-gray-200 mb-10 max-w-2xl mx-auto ${dir === 'rtl' ? 'arabic-text' : ''}`}>
          {t('hero.subtitle')}
        </p>
        
        <HeroSearch onSearchSubmit={handleSearchSubmit} />
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button 
            size="lg" 
            variant="default" 
            className={`bg-primary hover:bg-primary/90 text-white font-semibold ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
            onClick={() => navigate('/properties')}
          >
            <StarIcon className={`h-5 w-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
            {t('hero.exploreProperties')}
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className={`bg-white hover:bg-gray-100 text-primary font-semibold ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
            onClick={() => navigate('/about')}
          >
            <ArrowRightIcon className={`h-5 w-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
            {t('hero.learnMore')}
          </Button>
        </div>
      </div>
    </section>
  );
};