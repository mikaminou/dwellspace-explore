
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/MainNav";
import { SearchIcon, MapPinIcon, BedDoubleIcon, HomeIcon, ArrowRightIcon, StarIcon } from "lucide-react";
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
import { properties as mockProperties } from "@/data/properties"; // Import mock properties

// Video configuration
const VIDEO_BUCKET = "herosection";
const VIDEO_PATH = "hero.mp4";
// Fallback direct signed URL provided by the user (long expiry)
const FALLBACK_SIGNED_URL = "https://kaebtzbmtozoqvsdojkl.supabase.co/storage/v1/object/sign/herosection/hero.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJoZXJvc2VjdGlvbi9oZXJvLm1wNCIsImlhdCI6MTc0MTg5MTQyMCwiZXhwIjoxNzczNDI3NDIwfQ.ocQCcfFXgHHMW8do_xssp2P5csUFT-efMRtqqw_L1_M";

export default function Index() {
  const { t, dir } = useLanguage();
  const [videoError, setVideoError] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  
  // Initialize with the fallback URL, then try to get a public URL if available
  const [videoUrl, setVideoUrl] = useState(FALLBACK_SIGNED_URL);

  // Fetch properties from the database
  const { properties, loading, error } = useProperties();
  
  // If we have no properties from the database, use mock data instead
  const allProperties = properties.length > 0 ? properties : mockProperties;
  
  // Find premium properties (marked with isPremium or properties from premium users)
  const premiumProperties = allProperties.filter(p => 
    // From mock data we use the isPremium flag
    (p.isPremium === true) || 
    // For database properties, we could check if owner/agent has a premium role
    (p.owner && p.owner.role === 'seller') // Premium users are typically sellers in our model
  ).slice(0, 3);

  // Take properties for featured display (exclude premium ones)
  const featuredProperties = allProperties
    .filter(p => !premiumProperties.some(pp => pp.id === p.id))
    .slice(0, 3);

  // Define complete property types with proper translations
  const propertyTypes = [
    { value: "any", label: t('search.anyPropertyType') },
    { value: "apartment", label: t('search.apartment') },
    { value: "villa", label: t('search.villa') },
    { value: "house", label: "House" }, // Fixed translation
    { value: "land", label: "Land" }, // Fixed translation
    { value: "studio", label: t('search.studio') },
    { value: "duplex", label: t('search.duplex') },
    { value: "traditionalHouse", label: t('search.traditionalHouse') },
    { value: "loft", label: t('search.loft') },
    { value: "chalet", label: t('search.chalet') }
  ];

  // Function to check if video exists in storage and get appropriate URL
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
          // Try to get a public URL first, which works better for new tabs
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

  // Function to handle video load event
  const handleVideoLoad = () => {
    console.log("Video loaded successfully");
    setIsVideoLoading(false);
  };

  // Function to handle video error
  const handleVideoError = (error) => {
    console.error("Error loading video:", error);
    setVideoError(true);
    setIsVideoLoading(false);
    toast({
      title: "Video loading error",
      description: "Could not load the hero video. Using fallback image instead.",
      variant: "destructive",
    });
  };

  // Function to get property image
  const getPropertyImage = (property: Property) => {
    // For database properties
    if (property.featured_image_url) return property.featured_image_url;
    if (property.gallery_image_urls && property.gallery_image_urls.length > 0) 
      return property.gallery_image_urls[0];
    
    // For mock data properties
    if (property.image) return property.image;
    if (property.images && property.images.length > 0)
      return property.images[0];
      
    return "/img/placeholder-property.jpg"; // Fallback image
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      {/* Admin Alert for Missing Video */}
      {showAlert && (
        <Alert variant="destructive" className="mb-4 mx-4">
          <AlertTitle>Video File Missing</AlertTitle>
          <AlertDescription>
            The hero video (hero.mp4) needs to be uploaded to the "herosection" bucket in Supabase Storage.
            A static image is being shown as a fallback.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Hero Section */}
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
            <img 
              src="/img/algeria-real-estate.jpg" 
              alt={t('hero.title')} 
              className="object-cover w-full h-full opacity-20"
            />
          )}
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className={`text-5xl md:text-6xl font-bold mb-4 text-white text-center ${dir === 'rtl' ? 'arabic-text' : ''}`}>
            {t('hero.title')}
          </h1>
          <p className={`text-xl text-gray-200 mb-10 max-w-2xl mx-auto ${dir === 'rtl' ? 'arabic-text' : ''}`}>
            {t('hero.subtitle')}
          </p>
          
          {/* Modern Search Bar */}
          <div className="bg-white dark:bg-card p-2 rounded-lg shadow-lg mb-8 max-w-3xl mx-auto animate-slide-up delay-100">
            <div className="flex flex-col md:flex-row">
              <div className="flex-grow md:border-r dark:border-gray-700 p-2">
                <Input 
                  placeholder={t('search.location')}
                  className={`h-12 border-0 shadow-none ${dir === 'rtl' ? 'arabic-text text-right pr-4' : ''}`}
                  dir={dir}
                />
              </div>
              <div className="md:w-48 p-2">
                <Select>
                  <SelectTrigger className={`h-12 border-0 shadow-none ${dir === 'rtl' ? 'arabic-text text-right' : ''}`} dir={dir}>
                    <SelectValue placeholder={t('search.propertyType')} />
                  </SelectTrigger>
                  <SelectContent dir={dir}>
                    <SelectGroup>
                      {propertyTypes.map((type) => (
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
              <div className="p-2">
                <Button className={`w-full h-12 bg-primary hover:bg-primary/90 text-white ${dir === 'rtl' ? 'arabic-text flex-row-reverse' : ''}`} size="lg">
                  <SearchIcon className={`h-5 w-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                  {t('search.search')}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className={`bg-accent hover:bg-accent/90 text-white font-semibold ${dir === 'rtl' ? 'flex-row-reverse arabic-text' : ''}`}
              asChild
            >
              <Link to="/signup">
                {t('hero.list')}
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className={`bg-white hover:bg-white/90 text-secondary font-semibold ${dir === 'rtl' ? 'flex-row-reverse arabic-text' : ''}`}
              asChild
            >
              <Link to="/search" className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <SearchIcon className={`h-5 w-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                {t('hero.browse')}
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Luxury Properties Section - Moved to appear before Featured Properties */}
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
                      src={getPropertyImage(property)}
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
          )}
        </div>
      </section>
      
      {/* Featured Properties Section */}
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
              <Link 
                to={`/property/${property.id}`}
                key={property.id} 
                className="property-card fade-in group hover:scale-[1.02] transition-all bg-white dark:bg-card"
              >
                <div className="relative">
                  <img
                    src={getPropertyImage(property)}
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
        )}
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
