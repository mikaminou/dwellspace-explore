import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { Button } from "@/components/ui/button";
import { MapPinIcon, BedDoubleIcon, HomeIcon, HeartIcon, ShareIcon, CalendarIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { Textarea } from "@/components/ui/textarea";
import { Trans, TransHeading } from "@/components/ui/trans";
import { getPropertyById } from "@/api";
import { Property } from "@/api/properties";

export default function PropertyDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, dir } = useLanguage();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      setLoading(true);
      try {
        if (!id) throw new Error("Property ID is required");
        
        const fetchedProperty = await getPropertyById(id);
        setProperty(fetchedProperty);
      } catch (error) {
        console.error('Error fetching property details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <MainNav />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
            <div className="h-64 bg-gray-200 rounded w-full mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <MainNav />
        <div className="container mx-auto px-4 py-16 text-center">
          <TransHeading as="h1" id="property.notFound" className="text-3xl font-bold mb-4" />
          <p className="text-muted-foreground mb-8">
            <Trans id="property.notFoundDescription" />
          </p>
          <Button asChild>
            <a href="/">
              <Trans id="notFound.returnHome" />
            </a>
          </Button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    toast({
      title: t('property.savedTitle'),
      description: t('property.savedDescription'),
    });
  };

  const handleShare = () => {
    toast({
      title: t('property.shareTitle'),
      description: t('property.shareDescription'),
    });
  };

  const handleContact = () => {
    toast({
      title: t('property.contactTitle'),
      description: t('property.contactDescription'),
    });
    setMessage("");
  };

  const owner = property?.owner;
  const ownerName = owner ? `${owner.first_name} ${owner.last_name}`.trim() : 'Unknown';
  const ownerInitials = ownerName !== 'Unknown' ? ownerName.charAt(0) : '?';

  const getListingTypeLabel = (type: string) => {
    switch (type) {
      case 'sale': return t('property.forSale');
      case 'rent': return t('property.forRent');
      case 'construction': return t('property.underConstruction');
      default: return t('property.forSale');
    }
  };

  const getListingTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'sale': return 'bg-green-500 text-white';
      case 'rent': return 'bg-blue-500 text-white';
      case 'construction': return 'bg-amber-500 text-white';
      default: return 'bg-green-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2 aspect-video rounded-lg overflow-hidden relative">
            <img 
              src={property.featured_image_url || '/placeholder.svg'} 
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className={`absolute top-4 left-4 px-3 py-1.5 text-sm font-semibold rounded-md ${getListingTypeBadgeClass(property.listing_type)}`}>
              {getListingTypeLabel(property.listing_type)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {(property.gallery_image_urls || []).slice(1, 5).map((image: string, index: number) => (
              <div key={index} className="aspect-square rounded-lg overflow-hidden">
                <img 
                  src={image} 
                  alt={`${property.title} - ${t('property.view')} ${index + 2}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className={`flex flex-col md:flex-row justify-between items-start gap-4 mb-6 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <div className={dir === 'rtl' ? 'text-right' : ''}>
            <h1 className="text-3xl font-bold mb-2">
              {property.title}
            </h1>
            <div className={`flex items-center text-muted-foreground mb-2 ${dir === 'rtl' ? 'justify-end arabic-text' : ''}`}>
              <MapPinIcon className={`h-4 w-4 ${dir === 'rtl' ? 'ml-1' : 'mr-1'}`} />
              {property.location}
            </div>
            <div className={`flex items-center gap-4 ${dir === 'rtl' ? 'justify-end arabic-text' : ''}`}>
              <span className={`flex items-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <BedDoubleIcon className="h-4 w-4" />
                {property.beds} <Trans id="property.beds" />
              </span>
              <span className={`flex items-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <HomeIcon className="h-4 w-4" />
                {property.type}
              </span>
              {property.year_built && (
                <span className={`flex items-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <CalendarIcon className="h-4 w-4" />
                  <Trans id="property.built" /> {property.year_built}
                </span>
              )}
            </div>
          </div>
          <div className={`flex flex-col ${dir === 'rtl' ? 'items-start' : 'items-end'}`}>
            <span className="text-3xl font-bold text-primary mb-2">{property.price}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSave}>
                <HeartIcon className={`h-4 w-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                <Trans id="property.save" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <ShareIcon className={`h-4 w-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                <Trans id="property.share" />
              </Button>
            </div>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <TransHeading as="h2" id="property.details" className={`text-2xl font-semibold mb-4 ${dir === 'rtl' ? 'text-right' : ''}`} />
            <div className={`mb-6 ${dir === 'rtl' ? 'text-right arabic-text' : ''}`}>
              {property.description}
            </div>
            
            <TransHeading as="h3" id="property.features" className={`text-xl font-semibold mb-3 ${dir === 'rtl' ? 'text-right' : ''}`} />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 mb-6">
              {(property.features || []).map((feature: string, index: number) => (
                <div key={index} className={`flex items-center ${dir === 'rtl' ? 'flex-row-reverse justify-end arabic-text' : ''}`}>
                  <div className={`h-2 w-2 rounded-full bg-primary ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                  {feature}
                </div>
              ))}
            </div>
            
            {property.additional_details && (
              <>
                <TransHeading as="h3" id="property.additionalInfo" className={`text-xl font-semibold mb-3 ${dir === 'rtl' ? 'text-right' : ''}`} />
                <div className={`mb-6 ${dir === 'rtl' ? 'text-right arabic-text' : ''}`}>
                  {property.additional_details}
                </div>
              </>
            )}
          </div>
          
          <div>
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar>
                  <AvatarImage src={owner?.avatar_url} />
                  <AvatarFallback>{ownerInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">
                    {ownerName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {owner?.agency || (owner?.role === 'seller' ? 'Private Seller' : '')}
                  </p>
                </div>
              </div>
              <div className="space-y-4 mb-4">
                <Textarea 
                  className={`w-full min-h-[100px] p-3 border rounded-md ${dir === 'rtl' ? 'text-right' : ''}`}
                  placeholder={t('property.contactPlaceholder')}
                  dir={dir}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button className="w-full" onClick={handleContact}>
                  <Trans id="property.contactAgent" />
                </Button>
              </div>
              <p className={`text-xs text-muted-foreground text-center ${dir === 'rtl' ? 'arabic-text' : ''}`}>
                <Trans id="property.contactDisclaimer" />
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
