import React from 'react';
import { useLanguage } from "@/contexts/language/LanguageContext";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export const Footer: React.FC = () => {
  const { t, dir } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-secondary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${dir === 'rtl' ? 'arabic-text' : ''}`}>{t('footer.about')}</h3>
            <p className={`text-sm ${dir === 'rtl' ? 'arabic-text' : ''}`}>{t('footer.aboutText')}</p>
          </div>
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${dir === 'rtl' ? 'arabic-text' : ''}`}>{t('footer.quickLinks')}</h3>
            <ul className={`space-y-2 ${dir === 'rtl' ? 'arabic-text' : ''}`}>
              <li><Link to="/" className="text-sm hover:underline">{t('footer.home')}</Link></li>
              <li><Link to="/search" className="text-sm hover:underline">{t('footer.properties')}</Link></li>
              <li><Link to="/about" className="text-sm hover:underline">{t('footer.about')}</Link></li>
              <li><Link to="/contact" className="text-sm hover:underline">{t('footer.contact')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${dir === 'rtl' ? 'arabic-text' : ''}`}>{t('footer.contact')}</h3>
            <p className={`text-sm ${dir === 'rtl' ? 'arabic-text' : ''}`}>{t('footer.address')}</p>
            <p className="text-sm">Email: info@dwellspace.com</p>
            <p className="text-sm">{t('footer.phone')}: +213 123 456 789</p>
          </div>
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${dir === 'rtl' ? 'arabic-text' : ''}`}>{t('footer.followUs')}</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-secondary-foreground hover:text-primary"><Facebook size={20} /></a>
              <a href="#" className="text-secondary-foreground hover:text-primary"><Twitter size={20} /></a>
              <a href="#" className="text-secondary-foreground hover:text-primary"><Instagram size={20} /></a>
              <a href="#" className="text-secondary-foreground hover:text-primary"><Linkedin size={20} /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-secondary-foreground/10 text-center">
          <p className={`text-sm ${dir === 'rtl' ? 'arabic-text' : ''}`}>
            © {currentYear} DwellSpace. {t('footer.allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
};