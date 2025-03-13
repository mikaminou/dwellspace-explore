
import React, { createContext, useContext, useState, useEffect } from 'react';

type LanguageContextType = {
  language: 'ar' | 'fr' | 'en';
  setLanguage: (lang: 'ar' | 'fr' | 'en') => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
};

const translations = {
  ar: {
    'site.name': 'أسكن',
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
    'notifications.title': 'الإشعارات',
    'notifications.markAllRead': 'تعليم الكل كمقروء',
    'notifications.noNotifications': 'لا توجد إشعارات حتى الآن',
    'notifications.newProperty': 'عقار جديد معروض',
    'notifications.propertyMatch': 'عقار جديد يطابق معاييرك',
    'notifications.priceAlert': 'تنبيه انخفاض السعر',
    'otp.title': 'أدخل رمز التحقق',
    'otp.subtitle': 'تم إرسال رمز التحقق إلى',
    'otp.demoSubtitle': 'أدخل أي 6 أرقام للمتابعة في وضع العرض التوضيحي',
    'otp.verify': 'تحقق وإنشاء الحساب',
    'otp.back': 'رجوع',
    'demo.title': 'وضع العرض التوضيحي مفعل',
    'demo.description': 'لا يمكن معالجة التحقق من هاتفك بواسطة مزود الرسائل القصيرة. يمكنك المتابعة في وضع العرض التوضيحي حيث سيعمل أي رمز مكون من 6 أرقام.',
    'phone.label': 'رقم الهاتف',
    'phone.placeholder': '123456789',
    'phone.subtitle': 'أدخل رقم هاتفك بدون رمز البلد',
    'phone.send': 'إرسال رمز التحقق',
    'phone.sending': 'جاري إرسال الرمز...',
    'role.label': 'أنا',
    'role.subtitle': 'حدد دورك في المنصة',
    'role.buyer': 'مشتري',
    'role.seller': 'بائع',
    'role.agent': 'وكيل',
    'name.label': 'الاسم الكامل',
    'name.placeholder': 'اسمك',
    'email.label': 'البريد الإلكتروني',
    'email.placeholder': 'بريدك@الإلكتروني.com',
    'password.label': 'كلمة المرور',
    'password.placeholder': '••••••••',
    'password.requirement': 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل',
    'signup.button': 'إنشاء حساب',
    'signup.creating': 'جاري إنشاء الحساب...',
    'signup.emailSent': 'تم إرسال بريد التأكيد',
    'signup.demoActive': 'وضع العرض التوضيحي مفعل'
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
    'notifications.title': 'Notifications',
    'notifications.markAllRead': 'Marquer tout comme lu',
    'notifications.noNotifications': 'Pas encore de notifications',
    'notifications.newProperty': 'Nouvelle Propriété Listée',
    'notifications.propertyMatch': 'Une nouvelle propriété correspondant à vos critères a été listée',
    'notifications.priceAlert': 'Alerte de Baisse de Prix',
    'otp.title': 'Entrez le code de vérification',
    'otp.subtitle': 'Un code de vérification a été envoyé à',
    'otp.demoSubtitle': 'Entrez n\'importe quels 6 chiffres pour continuer en mode démo',
    'otp.verify': 'Vérifier et Créer un Compte',
    'otp.back': 'Retour',
    'demo.title': 'Mode Démo Activé',
    'demo.description': 'Votre vérification téléphonique n\'a pas pu être traitée par notre fournisseur de SMS. Vous pouvez continuer en mode démo où n\'importe quel code à 6 chiffres fonctionnera.',
    'phone.label': 'Numéro de Téléphone',
    'phone.placeholder': '123456789',
    'phone.subtitle': 'Entrez votre numéro de téléphone sans l\'indicatif du pays',
    'phone.send': 'Envoyer le Code de Vérification',
    'phone.sending': 'Envoi du code...',
    'role.label': 'Je suis un',
    'role.subtitle': 'Sélectionnez votre rôle sur la plateforme',
    'role.buyer': 'Acheteur',
    'role.seller': 'Vendeur',
    'role.agent': 'Agent',
    'name.label': 'Nom Complet',
    'name.placeholder': 'Votre nom',
    'email.label': 'Email',
    'email.placeholder': 'votre@email.com',
    'password.label': 'Mot de passe',
    'password.placeholder': '••••••••',
    'password.requirement': 'Le mot de passe doit comporter au moins 6 caractères',
    'signup.button': 'Créer un Compte',
    'signup.creating': 'Création du compte...',
    'signup.emailSent': 'Email de Confirmation Envoyé',
    'signup.demoActive': 'Mode Démo Actif'
  },
  en: {
    'site.name': 'Osken',
    'nav.home': 'Home',
    'nav.explore': 'Explore',
    'nav.sale': 'For Sale',
    'nav.rent': 'For Rent',
    'nav.map': 'Map',
    'nav.search': 'Search',
    'nav.signin': 'Sign In',
    'nav.signup': 'Sign Up',
    'nav.profile': 'Profile',
    'nav.favorites': 'Favorites',
    'nav.logout': 'Log Out',
    'hero.title': 'Find Your Ideal Space',
    'hero.subtitle': 'Discover thousands of properties for sale and rent',
    'hero.search': 'Search Properties',
    'hero.list': 'List Your Property',
    'featured.title': 'Featured Properties',
    'featured.viewAll': 'View All',
    'property.beds': 'beds',
    'property.save': 'Save',
    'account.myAccount': 'My Account',
    'signin.title': 'Sign In',
    'signin.subtitle': 'Enter your email and password to sign in',
    'signin.email': 'Email',
    'signin.password': 'Password',
    'signin.button': 'Sign In',
    'signin.noAccount': 'Don\'t have an account?',
    'signin.create': 'Create account',
    'notifications.title': 'Notifications',
    'notifications.markAllRead': 'Mark all as read',
    'notifications.noNotifications': 'No notifications yet',
    'notifications.newProperty': 'New Property Listed',
    'notifications.propertyMatch': 'A new property matching your criteria has been listed',
    'notifications.priceAlert': 'Price Drop Alert',
    'otp.title': 'Enter verification code',
    'otp.subtitle': 'A verification code has been sent to',
    'otp.demoSubtitle': 'Enter any 6 digits to continue in demo mode',
    'otp.verify': 'Verify & Create Account',
    'otp.back': 'Back',
    'demo.title': 'Demo Mode Active',
    'demo.description': 'Your phone verification couldn\'t be processed by our SMS provider. You can continue in demo mode where any 6-digit code will work.',
    'phone.label': 'Phone Number',
    'phone.placeholder': '123456789',
    'phone.subtitle': 'Enter your phone number without the country code',
    'phone.send': 'Send Verification Code',
    'phone.sending': 'Sending code...',
    'role.label': 'I am a',
    'role.subtitle': 'Select your role in the platform',
    'role.buyer': 'Buyer',
    'role.seller': 'Seller',
    'role.agent': 'Agent',
    'name.label': 'Full Name',
    'name.placeholder': 'Your name',
    'email.label': 'Email',
    'email.placeholder': 'your@email.com',
    'password.label': 'Password',
    'password.placeholder': '••••••••',
    'password.requirement': 'Password must be at least 6 characters long',
    'signup.button': 'Create Account',
    'signup.creating': 'Creating account...',
    'signup.emailSent': 'Confirmation Email Sent',
    'signup.demoActive': 'Demo Mode Active'
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
  const [language, setLanguageState] = useState<'ar' | 'fr' | 'en'>(() => {
    // Try to get saved language preference from localStorage
    const savedLang = localStorage.getItem('language');
    return (savedLang === 'ar' ? 'ar' : savedLang === 'en' ? 'en' : 'fr');
  });

  const setLanguage = (lang: 'ar' | 'fr' | 'en') => {
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
    return translations[language]?.[key as keyof typeof translations.fr] || key;
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
