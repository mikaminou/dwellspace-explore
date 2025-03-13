
import React, { createContext, useContext, useState, useEffect } from 'react';

type LanguageContextType = {
  language: 'ar' | 'fr';
  setLanguage: (lang: 'ar' | 'fr') => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
};

const translations = {
  ar: {
    'site.name': 'أوسكن',
    'nav.home': 'الرئيسية',
    'nav.explore': 'استكشاف',
    'nav.sale': 'للبيع',
    'nav.rent': 'للإيجار',
    'nav.map': 'الخريطة',
    'nav.search': 'بحث',
    'nav.signin': 'تسجيل الدخول',
    'nav.signup': 'إنشاء حساب',
    'nav.profile': 'الملف الشخصي',
    'nav.favorites': 'المفضلة',
    'nav.logout': 'تسجيل الخروج',
    'hero.title': 'ابحث عن مساحتك المثالية',
    'hero.subtitle': 'اكتشف آلاف العقارات للبيع والإيجار',
    'hero.search': 'ابحث عن عقارات',
    'hero.list': 'أضف عقارك',
    'featured.title': 'عقارات مميزة',
    'featured.viewAll': 'عرض الكل',
    'property.beds': 'غرف',
    'property.save': 'حفظ',
    'account.myAccount': 'حسابي',
    'signin.title': 'تسجيل الدخول',
    'signin.subtitle': 'أدخل بريدك الإلكتروني وكلمة المرور لتسجيل الدخول',
    'signin.email': 'البريد الإلكتروني',
    'signin.password': 'كلمة المرور',
    'signin.button': 'تسجيل الدخول',
    'signin.noAccount': 'ليس لديك حساب؟',
    'signin.create': 'إنشاء حساب',
  },
  fr: {
    'site.name': 'Osken',
    'nav.home': 'Accueil',
    'nav.explore': 'Explorer',
    'nav.sale': 'À Vendre',
    'nav.rent': 'À Louer',
    'nav.map': 'Carte',
    'nav.search': 'Rechercher',
    'nav.signin': 'Se Connecter',
    'nav.signup': 'S\'inscrire',
    'nav.profile': 'Profil',
    'nav.favorites': 'Favoris',
    'nav.logout': 'Se Déconnecter',
    'hero.title': 'Trouvez Votre Espace Idéal',
    'hero.subtitle': 'Découvrez des milliers de propriétés à vendre et à louer',
    'hero.search': 'Rechercher des Propriétés',
    'hero.list': 'Lister Votre Propriété',
    'featured.title': 'Propriétés en Vedette',
    'featured.viewAll': 'Voir Tout',
    'property.beds': 'chambres',
    'property.save': 'Sauvegarder',
    'account.myAccount': 'Mon Compte',
    'signin.title': 'Se Connecter',
    'signin.subtitle': 'Entrez votre email et mot de passe pour vous connecter',
    'signin.email': 'Email',
    'signin.password': 'Mot de passe',
    'signin.button': 'Se Connecter',
    'signin.noAccount': 'Vous n\'avez pas de compte?',
    'signin.create': 'Créer un compte',
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'fr',
  setLanguage: () => {},
  t: (key: string) => key,
  dir: 'ltr',
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<'ar' | 'fr'>(() => {
    // Try to get saved language preference from localStorage
    const savedLang = localStorage.getItem('language');
    return (savedLang === 'ar' ? 'ar' : 'fr');
  });

  const setLanguage = (lang: 'ar' | 'fr') => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    // Set initial direction based on language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.fr] || key;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t,
      dir: language === 'ar' ? 'rtl' : 'ltr'
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
