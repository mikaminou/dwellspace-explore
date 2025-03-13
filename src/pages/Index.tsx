
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/MainNav";
import { SearchIcon, MapPinIcon, BedDoubleIcon, HomeIcon, ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { properties } from "@/data/properties";
import { useLanguage } from "@/contexts/language/LanguageContext";

// Take first 3 properties for featured display
const featuredProperties = properties.slice(0, 3);

export default function Index() {
  const { t, dir } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <h1 className={`text-4xl md:text-6xl font-bold mb-6 slide-up ${dir === 'rtl' ? 'arabic-text' : ''}`}>
            {t('hero.title')}
          </h1>
          <p className={`text-xl text-muted-foreground mb-8 slide-up ${dir === 'rtl' ? 'arabic-text' : ''}`}>
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center slide-up">
            <Button size="lg" className="font-semibold bg-gradient-to-r from-primary to-blue-500 hover:from-blue-600 hover:to-primary" asChild>
              <Link to="/search" className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <SearchIcon className="h-5 w-5" />
                {t('hero.search')}
              </Link>
            </Button>
            <Button size="lg" variant="outline" className={`font-semibold ${dir === 'rtl' ? 'arabic-text' : ''}`}>
              {t('hero.list')}
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 container mx-auto px-4">
        <div className={`flex justify-between items-center mb-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <h2 className={`text-3xl font-bold ${dir === 'rtl' ? 'arabic-text' : ''}`}>{t('featured.title')}</h2>
          <Button variant="outline" asChild>
            <Link to="/search" className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              {t('featured.viewAll')}
              <ArrowRightIcon className={`h-4 w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((property) => (
            <Link 
              to={`/property/${property.id}`}
              key={property.id} 
              className="property-card fade-in group hover:scale-[1.02] transition-all"
            >
              <div className="relative">
                <img
                  src={property.image}
                  alt={property.title}
                  className="property-image"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {t('property.save')}
                </Button>
              </div>
              <div className={`property-details ${dir === 'rtl' ? 'text-right' : ''}`}>
                <div className={`flex justify-between items-start mb-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <h3 className="text-lg font-semibold">{property.title}</h3>
                  <span className="text-primary font-semibold">{property.price}</span>
                </div>
                <div className={`flex items-center gap-4 text-muted-foreground ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <span className={`flex items-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse arabic-text' : ''}`}>
                    <MapPinIcon className="h-4 w-4" />
                    {property.location}
                  </span>
                  <span className={`flex items-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse arabic-text' : ''}`}>
                    <BedDoubleIcon className="h-4 w-4" />
                    {property.beds} {t('property.beds')}
                  </span>
                  <span className={`flex items-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse arabic-text' : ''}`}>
                    <HomeIcon className="h-4 w-4" />
                    {property.type}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
