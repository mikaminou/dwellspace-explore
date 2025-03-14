
import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, SupportedLanguage, TranslationKey } from './translations';

type LanguageContextType = {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, defaultText?: string) => string;
  dir: 'rtl' | 'ltr';
  translateUserInput: (text: string, originalLanguage?: SupportedLanguage) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'fr',
  setLanguage: () => {},
  t: (key: string) => key,
  dir: 'ltr',
  translateUserInput: (text: string) => text,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    // Try to get saved language preference from localStorage
    const savedLang = localStorage.getItem('language');
    return (savedLang === 'ar' ? 'ar' : savedLang === 'en' ? 'en' : 'fr');
  });

  const setLanguage = (lang: SupportedLanguage) => {
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

  const t = (key: string, defaultText?: string): string => {
    return translations[language]?.[key as keyof typeof translations.fr] || defaultText || key;
  };

  // Enhanced function to display user input in the selected language
  const translateUserInput = (text: string, originalLanguage?: SupportedLanguage): string => {
    if (!text) return '';
    
    // For demonstration purposes: expanded translation dictionary
    const demoTranslations: Record<string, Record<SupportedLanguage, string>> = {
      // Common phrases
      "Hello World": {
        en: "Hello World",
        fr: "Bonjour le Monde",
        ar: "مرحبا بالعالم"
      },
      "My name is": {
        en: "My name is",
        fr: "Je m'appelle",
        ar: "اسمي هو"
      },
      "I am a buyer": {
        en: "I am a buyer",
        fr: "Je suis un acheteur",
        ar: "أنا مشتري"
      },
      "I am a seller": {
        en: "I am a seller",
        fr: "Je suis un vendeur",
        ar: "أنا بائع"
      },
      "I am an agent": {
        en: "I am an agent",
        fr: "Je suis un agent",
        ar: "أنا وكيل"
      },
      // Property types
      "Apartment": {
        en: "Apartment",
        fr: "Appartement",
        ar: "شقة"
      },
      "Villa": {
        en: "Villa",
        fr: "Villa",
        ar: "فيلا"
      },
      "Duplex": {
        en: "Duplex",
        fr: "Duplex",
        ar: "دوبلكس"
      },
      "Studio": {
        en: "Studio",
        fr: "Studio",
        ar: "استوديو"
      },
      // Locations
      "Hydra, Algiers": {
        en: "Hydra, Algiers",
        fr: "Hydra, Alger",
        ar: "حيدرة، الجزائر"
      },
      "Modern Apartment in Hydra": {
        en: "Modern Apartment in Hydra",
        fr: "Appartement Moderne à Hydra",
        ar: "شقة عصرية في حيدرة"
      },
      // Property features
      "Air conditioning": {
        en: "Air conditioning",
        fr: "Climatisation",
        ar: "تكييف الهواء"
      },
      "Parking": {
        en: "Parking",
        fr: "Stationnement",
        ar: "موقف سيارات"
      },
      "Elevator": {
        en: "Elevator",
        fr: "Ascenseur",
        ar: "مصعد"
      },
      "Swimming pool": {
        en: "Swimming pool",
        fr: "Piscine",
        ar: "حمام سباحة"
      },
      "Balcony": {
        en: "Balcony",
        fr: "Balcon",
        ar: "شرفة"
      },
      "Garden": {
        en: "Garden",
        fr: "Jardin",
        ar: "حديقة"
      },
      "Security system": {
        en: "Security system",
        fr: "Système de sécurité",
        ar: "نظام أمني"
      },
      "Furnished": {
        en: "Furnished",
        fr: "Meublé",
        ar: "مفروش"
      },
      "Granite countertops": {
        en: "Granite countertops",
        fr: "Comptoirs en granit",
        ar: "أسطح جرانيت"
      },
      "Ceramic floors": {
        en: "Ceramic floors",
        fr: "Sols en céramique",
        ar: "أرضيات سيراميك"
      },
      "Central air conditioning": {
        en: "Central air conditioning",
        fr: "Climatisation centrale",
        ar: "تكييف مركزي"
      },
      "Built-in wardrobes": {
        en: "Built-in wardrobes",
        fr: "Placards intégrés",
        ar: "خزائن مدمجة"
      },
      "Private parking": {
        en: "Private parking",
        fr: "Parking privé",
        ar: "موقف سيارات خاص"
      },
      "Security 24/7": {
        en: "Security 24/7",
        fr: "Sécurité 24/7",
        ar: "أمن على مدار الساعة"
      },
      // Agency names
      "Dar Immobilier": {
        en: "Dar Real Estate",
        fr: "Dar Immobilier",
        ar: "دار العقارية"
      },
      // Agent names
      "Amina Benali": {
        en: "Amina Benali",
        fr: "Amina Benali",
        ar: "أمينة بن علي"
      },
      // Property descriptions
      "A beautiful modern apartment in the upscale neighborhood of Hydra with stunning city views. This 3-bedroom, 2-bathroom unit features high ceilings, ceramic floors, and an open floor plan perfect for entertaining. The kitchen is equipped with high-end appliances and granite countertops. The primary bedroom has a walk-in closet and ensuite bathroom.": {
        en: "A beautiful modern apartment in the upscale neighborhood of Hydra with stunning city views. This 3-bedroom, 2-bathroom unit features high ceilings, ceramic floors, and an open floor plan perfect for entertaining. The kitchen is equipped with high-end appliances and granite countertops. The primary bedroom has a walk-in closet and ensuite bathroom.",
        fr: "Un bel appartement moderne dans le quartier huppé de Hydra avec une vue imprenable sur la ville. Cet appartement de 3 chambres et 2 salles de bains présente des plafonds hauts, des sols en céramique et un plan ouvert parfait pour recevoir. La cuisine est équipée d'appareils haut de gamme et de comptoirs en granit. La chambre principale dispose d'un dressing et d'une salle de bains attenante.",
        ar: "شقة عصرية جميلة في حي حيدرة الراقي مع إطلالات خلابة على المدينة. تتميز هذه الوحدة المكونة من 3 غرف نوم وحمامين بأسقف عالية وأرضيات سيراميك وتصميم مفتوح مثالي للترفيه. المطبخ مجهز بأجهزة عالية الجودة وأسطح جرانيت. تحتوي غرفة النوم الرئيسية على خزانة ملابس كبيرة وحمام داخلي."
      },
      "Condominium fees: 10,000 DZD/month. Includes water, trash, security, and building maintenance.": {
        en: "Condominium fees: 10,000 DZD/month. Includes water, trash, security, and building maintenance.",
        fr: "Frais de copropriété: 10 000 DZD/mois. Comprend l'eau, les ordures, la sécurité et l'entretien du bâtiment.",
        ar: "رسوم المجمع السكني: 10,000 دج/شهر. تشمل الماء والنفايات والأمن وصيانة المبنى."
      },
      "View": {
        en: "View",
        fr: "Vue",
        ar: "عرض"
      }
    };
    
    // Check if we have a direct translation for this text
    if (demoTranslations[text] && demoTranslations[text][language]) {
      return demoTranslations[text][language];
    }
    
    // If no direct match, check if any key in our translations is a substring of the text
    // This helps with partial matches like "Modern Apartment" in "Modern Apartment with Garden"
    for (const key in demoTranslations) {
      if (text.includes(key) && demoTranslations[key][language]) {
        // Replace just that part with the translation
        return text.replace(key, demoTranslations[key][language]);
      }
    }
    
    return text; // Return original text if no translation is available
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t,
      dir: language === 'ar' ? 'rtl' : 'ltr',
      translateUserInput
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
