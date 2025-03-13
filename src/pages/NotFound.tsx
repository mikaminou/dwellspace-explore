
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HomeIcon } from "lucide-react";
import { MainNav } from "@/components/MainNav";

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
    <div className="min-h-screen flex flex-col bg-background">
      <MainNav />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h1 className="text-8xl font-bold mb-4 text-secondary dark:text-white animate-fade-in">404</h1>
          <p className={`text-xl text-muted-foreground mb-8 animate-slide-up ${dir === 'rtl' ? 'arabic-text' : ''}`}>
            {t('notFound.title')}
          </p>
          <p className={`text-base text-muted-foreground mb-8 animate-slide-up delay-75 ${dir === 'rtl' ? 'arabic-text' : ''}`}>
            {t('notFound.message') || "The page you're looking for doesn't exist or has been moved."}
          </p>
          <Button 
            asChild 
            size="lg"
            className={`bg-primary hover:bg-primary-dark animate-slide-up delay-150 ${dir === 'rtl' ? 'arabic-text' : ''}`}
          >
            <Link to="/" className="flex items-center gap-2">
              <HomeIcon size={18} />
              {t('notFound.returnHome')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
