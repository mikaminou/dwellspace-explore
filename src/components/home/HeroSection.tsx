
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { getMediaUrl, checkFileExists } from "@/integrations/supabase/client";

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

export default function HeroSection() {
  const { t, dir } = useLanguage();
  const [videoError, setVideoError] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  
  const [videoUrl, setVideoUrl] = useState(FALLBACK_SIGNED_URL);

  // Check for video existence but handle errors gracefully
  useEffect(() => {
    const checkVideoExists = async () => {
      try {
        // Try to check if video exists, but don't block rendering if it fails
        const fileExists = await checkFileExists(VIDEO_BUCKET, VIDEO_PATH);
        
        if (!fileExists) {
          console.log("Video file not found in storage");
          setVideoError(true);
          setShowAlert(true);
        } else {
          const publicUrl = getMediaUrl(VIDEO_BUCKET, VIDEO_PATH);
          setVideoUrl(publicUrl);
        }
      } catch (err) {
        console.log("Error checking video:", err);
        setVideoError(true);
      } finally {
        // Ensure video loading state is completed even if there's an error
        setIsVideoLoading(false);
      }
    };
    
    checkVideoExists().catch(() => {
      // Fallback error handling
      setVideoError(true);
      setIsVideoLoading(false);
    });
  }, []);

  // Handle video load
  const handleVideoLoad = () => {
    console.log("Video loaded successfully");
    setIsVideoLoading(false);
  };

  // Handle video error
  const handleVideoError = () => {
    console.log("Error loading video, using fallback image");
    setVideoError(true);
    setIsVideoLoading(false);
  };

  return (
    <>
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
          
          <div className="bg-white dark:bg-card p-2 rounded-lg shadow-lg mb-8 max-w-3xl mx-auto animate-slide-up delay-100">
            <div className="flex flex-col md:flex-row">
              <div className="flex-grow md:border-r dark:border-gray-700 p-2">
                <Input 
                  placeholder={t('search.location')}
                  className={`h-12 border-0 shadow-none ${dir === 'rtl' ? 'arabic-text text-right pr-4' : ''}`}
                  dir={dir}
                />
              </div>
              <div className="md:w-44 p-2">
                <Select>
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
                          {t(`search.${type.value === 'any' ? 'anyPropertyType' : type.value}`)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:w-44 p-2">
                <Select>
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
                <Button className={`w-full h-12 bg-primary hover:bg-primary/90 text-white ${dir === 'rtl' ? 'arabic-text flex-row-reverse' : ''}`} size="lg">
                  <SearchIcon className={`h-5 w-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                  {t('search.search')}
                </Button>
              </div>
            </div>
          </div>
          
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
    </>
  );
}
