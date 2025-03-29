import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/MainNav";
import { SearchIcon, ArrowRightIcon, StarIcon, Plus, LayoutDashboard, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase, getMediaUrl, checkFileExists } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useProperties } from "@/hooks/useProperties";
import { Property } from "@/api/properties";
import PropertyCard from "@/components/PropertyCard";
import { useProfile } from "@/hooks/useProfile";
import { SearchSuggestions } from "@/components/search/SearchSuggestions";

const VIDEO_BUCKET = "herosection";
const VIDEO_PATH = "hero.mp4";
const FALLBACK_SIGNED_URL = "https://kaebtzbmtozoqvsdojkl.supabase.co/storage/v1/object/sign/herosection/hero.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJoZXJvc2VjdGlvbi9oZXJvLm1wNCIsImlhdCI6MTc0MTg5MTQyMCwiZXhwIjoxNzczNDI3NDIwfQ.ocQCcfFXgHHMW8do_xssp2P5csUFT-efMRtqqw_L1_M";

const propertyTypeOptions = [
  { value: "any", label: "Any Type" },
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "villa", label: "Villa" },
  { value: "office", label: "Office" },
  { value: "commercial", label: "Commercial" },
];

const listingTypeOptions = [
  { value: "any", label: "Any Type" },
  { value: "sale", label: "For Sale" },
  { value: "rent", label: "For Rent" },
  { value: "construction", label: "Under Construction" },
];

export default function Index() {
  const { t, dir } = useLanguage();
  const [videoError, setVideoError] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState('any');
  const [selectedListingType, setSelectedListingType] = useState('any');
  
  const { profileData, isLoaded: isProfileLoaded } = useProfile(false);
  
  const userRole = profileData?.role ?? "buyer";
  const isSellerOrAgent = isProfileLoaded && profileData ? ["seller", "agent", "admin"].includes(userRole) : false;
  
  const [videoUrl, setVideoUrl] = useState(FALLBACK_SIGNED_URL);

  const { properties, loading, error } = useProperties();
  
  const allProperties = properties;
  
  const premiumProperties = allProperties.filter((p: Property) => 
    (p.isPremium === true) || 
    (p.owner && p.owner.role === 'seller')
  ).slice(0, 3);

  const featuredProperties = allProperties
    .filter((p: Property) => !premiumProperties.some(pp => pp.id === p.id))
    .slice(0, 3);

  const getPropertyImage = (property: Property): string => {
    if (property.featured_image_url) return property.featured_image_url;
    if (property.gallery_image_urls && property.gallery_image_urls.length > 0) 
      return property.gallery_image_urls[0];
    
    if (property.image) return property.image;
    if (property.images && property.images.length > 0)
      return property.images[0];
      
    return "/img/placeholder-property.jpg";
  };

  const getListingTypeColor = (property: Property): string => {
    if (property.listing_type === 'rent') return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300';
    if (property.listing_type === 'construction') return 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300';
    return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300';
  };

  const getListingTypeText = (property: Property): string => {
    if (property.listing_type === 'rent') return t('property.forRent');
    if (property.listing_type === 'construction') return t('property.underConstruction');
    return t('property.forSale');
  };

  useEffect(() => {
    const checkVideoExists = async () => {
      try {
        const fileExists = await checkFileExists(VIDEO_BUCKET, VIDEO_PATH);
        
        if (!fileExists) {
          console.error("Video file not found in storage");
          setVideoError(true);
          setShowAlert(true);
          toast({
            title: "Video file not found",
            description: "The hero video is not available. Please upload it to the Supabase storage.",
            variant: "destructive",
          });
        } else {
          const publicUrl = getMediaUrl(VIDEO_BUCKET, VIDEO_PATH);
          setVideoUrl(publicUrl);
        }
      } catch (err) {
        console.error("Error checking video:", err);
        setVideoError(true);
      }
    };
    
    checkVideoExists();
  }, []);

  const handleVideoLoad = () => {
    console.log("Video loaded successfully");
    setIsVideoLoading(false);
  };

  const handleVideoError = (error: any) => {
    console.error("Error loading video:", error);
    setVideoError(true);
    setIsVideoLoading(false);
    toast({
      title: "Video loading error",
      description: "Could not load the hero video. Using fallback image instead.",
      variant: "destructive",
    });
  };

  const handleSearchSubmit = () => {
    if (searchInput.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchInput)}&propertyType=${selectedPropertyType}&listingType=${selectedListingType}`;
    }
  };

  const handleSelectSuggestion = (suggestion?: string) => {
    if (suggestion && suggestion.trim()) {
      setSearchInput(suggestion);
      setShowSearchSuggestions(false);
      handleSearchSubmit();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchSuggestions(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      {showAlert && (
        <Alert variant="destructive" className="mb-4 mx-4">
          <AlertTitle>Video File Missing</AlertTitle>
          <AlertDescription>
            The hero video (hero.mp4) needs to be uploaded to the "herosection" bucket in Supabase Storage.
            A static image is being shown as a fallback.
          </AlertDescription>
        </Alert>
      )}
      
      <section className="relative h-[80vh] flex items-center justify-center bg-secondary/90">
        <div className="absolute inset-0 overflow-hidden z-0">
          {!videoError ? (
            <video 
              className="w-full h-full object-cover opacity-30"
              autoPlay
              muted
              loop
              playsInline
              poster="/img/algeria-real-estate.jpg" 
              onLoadedData={handleVideoLoad}
              onError={handleVideoError}
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img 
              src="/img/algeria-real-estate.jpg" 
              alt={t('hero.title')} 
              className="object-cover w-full h-full opacity-20"
            />
          )}
          
          {isVideoLoading && !videoError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <p className="text-white">Loading video...</p>
            </div>
          )}
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className={`text-5xl md:text-6xl font-bold mb-4 text-white text-center ${dir === 'rtl' ? 'arabic-text' : ''}`}>
            {t('hero.title')}
          </h1>
          <p className={`text-xl text-gray-200 mb-10 max-w-2xl mx-auto ${dir === 'rtl' ? 'arabic-text' : ''}`}>
            {t('hero.subtitle')}
          </p>
          
          <div className="bg-white dark:bg-card p-2 rounded-lg shadow-lg mb-8 max-w-3xl mx-auto animate-slide-up delay-100">
            <div className="flex flex-col md:flex-row">
              <div className="flex-grow md:border-r dark:border-gray-700 p-2 relative">
                <Input 
                  placeholder={t('search.location')}
                  className={`h-12 border-0 shadow-none ${dir === 'rtl' ? 'arabic-text text-right pr-4' : ''}`}
                  dir={dir}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onFocus={() => setShowSearchSuggestions(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchSubmit();
                    }
                  }}
                />
                
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <div className="bg-cta/10 text-cta text-xs p-1 rounded-md flex items-center">
                    <Sparkles className="h-3 w-3 mr-1" />
                    <span>{t('search.ai') || "AI"}</span>
                  </div>
                </div>
              </div>
              <div className="md:w-44 p-2">
                <Select 
                  value={selectedPropertyType} 
                  onValueChange={setSelectedPropertyType}
                >
                  <SelectTrigger className={`h-12 border-0 shadow-none ${dir === 'rtl' ? 'arabic-text text-right' : ''}`} dir={dir}>
                    <SelectValue placeholder={t('search.propertyType')} />
                  </SelectTrigger>
                  <SelectContent dir={dir}>
                    <SelectGroup>
                      {propertyTypeOptions.map((type) => (
                        <SelectItem 
                          key={type.value} 
                          value={type.value} 
                          className={dir === 'rtl' ? 'arabic-text text-right' : ''}
                        >
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:w-44 p-2">
                <Select
                  value={selectedListingType}
                  onValueChange={setSelectedListingType}
                >
                  <SelectTrigger className={`h-12 border-0 shadow-none ${dir === 'rtl' ? 'arabic-text text-right' : ''}`} dir={dir}>
                    <SelectValue placeholder={t('search.listingType')} />
                  </SelectTrigger>
                  <SelectContent dir={dir}>
                    <SelectGroup>
                      {listingTypeOptions.map((type) => (
                        <SelectItem 
                          key={type.value} 
                          value={type.value} 
                          className={dir === 'rtl' ? 'arabic-text text-right' : ''}
                        >
                          {t(`search.${type.value === 'any' ? 'anyListingType' : type.value === 'sale' ? 'forSale' : type.value === 'rent' ? 'forRent' : 'underConstruction'}`)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-2">
                <Button 
                  className={`w-full h-12 bg-primary hover:bg-primary/90 text-white ${dir === 'rtl' ? 'arabic-text flex-row-reverse' : ''}`} 
                  size="lg"
                  onClick={handleSearchSubmit}
                >
                  <SearchIcon className={`h-5 w-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                  {t('search.search')}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isProfileLoaded && isSellerOrAgent ? (
              <>
                <Button 
                  size="lg" 
                  variant="default" 
                  className={`bg-primary hover:bg-primary/90 text-white font-semibold ${dir === 'rtl' ? 'flex-row-reverse arabic-text' : ''}`}
                  asChild
                >
                  <Link to="/dashboard" className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <LayoutDashboard className={`h-5 w-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                    {t('hero.viewDashboard') || "View Dashboard"}
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  className={`bg-accent hover:bg-accent/90 text-white font-semibold ${dir === 'rtl' ? 'flex-row-reverse arabic-text' : ''}`}
                  asChild
                >
                  <Link to="/property-create" className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <Plus className={`h-5 w-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                    {t('hero.createProperty') || "List Your Property"}
                  </Link>
                </Button>
              </>
            ) : (
              <Button 
                size="lg" 
                className={`bg-accent hover:bg-accent/90 text-white font-semibold ${dir === 'rtl' ? 'flex-row-reverse arabic-text' : ''}`}
                asChild
              >
                <Link to="/search">
                  {t('hero.browse')}
                </Link>
              </Button>
            )}
          </div>
        </div>

        <SearchSuggestions
          open={showSearchSuggestions}
          setOpen={setShowSearchSuggestions}
          searchTerm={searchInput}
          setSearchTerm={setSearchInput}
          onSelectSuggestion={handleSelectSuggestion}
        />
      </section>
      
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
          
          {loading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Loading properties...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-destructive">Failed to load properties</p>
            </div>
          ) : premiumProperties.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No luxury properties found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {premiumProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>
      
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

        {loading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Loading properties...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-destructive">Failed to load properties</p>
          </div>
        ) : featuredProperties.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No properties found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>
      
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
              <Link to="/search" className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
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
              <Link to="/contact" className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                {t('cta.contact')}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
