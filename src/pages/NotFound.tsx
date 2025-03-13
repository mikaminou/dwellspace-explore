
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
        <h1 className="text-6xl font-bold mb-4 text-gray-800">404</h1>
        <p className={`text-xl text-gray-600 mb-6 ${dir === 'rtl' ? 'arabic-text' : ''}`}>
          {t('notFound.title') || "Oops! Page not found"}
        </p>
        <Button asChild>
          <Link to="/" className={dir === 'rtl' ? 'arabic-text' : ''}>
            {t('notFound.returnHome') || "Return to Home"}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
