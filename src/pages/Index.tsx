
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/MainNav";
import { SearchIcon, MapPinIcon, BedDoubleIcon, HomeIcon, ArrowRightIcon, StarIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { properties } from "@/data/properties";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Take first 6 properties for featured display
const featuredProperties = properties.slice(0, 3);
const luxuryProperties = properties.slice(3, 6).map(p => ({...p, luxury: true}));

export default function Index() {
  const { t, dir } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gradient-to-r from-secondary to-secondary/80">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="/img/algeria-real-estate.jpg" 
            alt={t('hero.title')} 
            className="object-cover w-full h-full opacity-20"
          />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className={`text-4xl md:text-6xl font-bold mb-6 text-white animate-fade-in ${dir === 'rtl' ? 'arabic-text' : ''}`}>
            {t('hero.title')}
          </h1>
          <p className={`text-xl text-gray-200 mb-10 max-w-2xl mx-auto animate-slide-up ${dir === 'rtl' ? 'arabic-text' : ''}`}>
            {t('hero.subtitle')}
          </p>
          
          {/* Advanced Search Bar */}
          <div className="bg-white dark:bg-card p-4 rounded-lg shadow-lg mb-10 max-w-4xl mx-auto animate-slide-up delay-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input 
                  placeholder={t('search.location') || "Location, property name, or keyword"}
                  className={`h-12 ${dir === 'rtl' ? 'arabic-text text-right' : ''}`}
                  dir={dir}
                />
              </div>
              <div>
                <Select>
                  <SelectTrigger className={`h-12 ${dir === 'rtl' ? 'arabic-text text-right' : ''}`}>
                    <SelectValue placeholder={t('search.propertyType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="any">{t('search.anyPropertyType')}</SelectItem>
                      <SelectItem value="apartment">{t('search.apartment')}</SelectItem>
                      <SelectItem value="villa">{t('search.villa')}</SelectItem>
                      <SelectItem value="house">{t('search.house')}</SelectItem>
                      <SelectItem value="land">{t('search.land')}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Button className={`w-full h-12 bg-primary hover:bg-primary-dark text-white ${dir === 'rtl' ? 'arabic-text flex-row-reverse' : ''}`} size="lg">
                  <SearchIcon className="h-5 w-5 mr-2" />
                  {t('search.search')}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up delay-200">
            <Button 
              size="lg" 
              variant="cta"
              className={`font-semibold ${dir === 'rtl' ? 'flex-row-reverse arabic-text' : ''}`}
              asChild
            >
              <Link to="/signup" className="flex items-center gap-2">
                {t('hero.list')}
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="white" 
              className={`font-semibold ${dir === 'rtl' ? 'flex-row-reverse arabic-text' : ''}`}
              asChild
            >
              <Link to="/search" className="flex items-center gap-2">
                <SearchIcon className="h-5 w-5" />
                {t('hero.browse')}
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Featured Properties */}
      <section className="py-16 container mx-auto px-4 animate-fade-in">
        <div className={`flex justify-between items-center mb-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <h2 className={`text-3xl font-bold ${dir === 'rtl' ? 'arabic-text' : ''}`}>
            {t('featured.title')}
          </h2>
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
              className="property-card fade-in group hover:scale-[1.02] transition-all bg-white dark:bg-card"
            >
              <div className="relative">
                <img
                  src={property.image || property.images[0]}
                  alt={property.title}
                  className="property-image"
                />
                <Button
                  variant="white"
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
      
      {/* Luxury Properties Section */}
      <section className="py-16 bg-gray-50 dark:bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className={`flex justify-between items-center mb-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <h2 className={`text-3xl font-bold flex items-center gap-2 ${dir === 'rtl' ? 'arabic-text flex-row-reverse' : ''}`}>
              <StarIcon className="h-6 w-6 text-luxury" />
              {t('luxury.title')}
            </h2>
            <Button variant="luxury" asChild>
              <Link to="/search?luxury=true" className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                {t('luxury.viewAll')}
                <ArrowRightIcon className={`h-4 w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {luxuryProperties.map((property) => (
              <Link 
                to={`/property/${property.id}`}
                key={property.id} 
                className="property-card premium-property fade-in group hover:scale-[1.02] transition-all bg-white dark:bg-card"
              >
                <div className="relative">
                  <div className="luxury-badge">
                    {t('luxury.badge')}
                  </div>
                  <img
                    src={property.image || property.images[0]}
                    alt={property.title}
                    className="property-image"
                  />
                  <Button
                    variant="white"
                    size="sm"
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {t('property.save')}
                  </Button>
                </div>
                <div className={`property-details ${dir === 'rtl' ? 'text-right' : ''}`}>
                  <div className={`flex justify-between items-start mb-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <h3 className="text-lg font-semibold">{property.title}</h3>
                    <span className="text-luxury font-semibold">{property.price}</span>
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
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-primary/10 dark:bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${dir === 'rtl' ? 'arabic-text' : ''}`}>
            {t('cta.title')}
          </h2>
          <p className={`text-xl text-muted-foreground mb-8 max-w-2xl mx-auto ${dir === 'rtl' ? 'arabic-text' : ''}`}>
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="xl" 
              variant="cta"
              className={`font-semibold ${dir === 'rtl' ? 'flex-row-reverse arabic-text' : ''}`}
              asChild
            >
              <Link to="/search" className="flex items-center gap-2">
                <SearchIcon className="h-5 w-5" />
                {t('cta.search')}
              </Link>
            </Button>
            <Button 
              size="xl" 
              variant="secondary" 
              className={`font-semibold ${dir === 'rtl' ? 'flex-row-reverse arabic-text' : ''}`}
              asChild
            >
              <Link to="/contact" className="flex items-center gap-2">
                {t('cta.contact')}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
