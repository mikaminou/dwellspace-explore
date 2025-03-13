
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/language/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const { t, dir } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className={`text-xl text-gray-600 mb-4 ${dir === 'rtl' ? 'arabic-text' : ''}`}>
          {t('notFound.title') || "Oops! Page not found"}
        </p>
        <a href="/" className={`text-blue-500 hover:text-blue-700 underline ${dir === 'rtl' ? 'arabic-text' : ''}`}>
          {t('notFound.returnHome') || "Return to Home"}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
