
import React from "react";
import { useParams } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { Button } from "@/components/ui/button";
import { MapPinIcon, BedDoubleIcon, HomeIcon, HeartIcon, ShareIcon, CalendarIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { properties } from "@/data/properties";
import { useLanguage } from "@/contexts/language/LanguageContext";

export default function PropertyDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const property = properties.find((p) => p.id === parseInt(id as string));
  const { t, dir } = useLanguage();

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <MainNav />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className={`text-3xl font-bold mb-4 ${dir === 'rtl' ? 'arabic-text' : ''}`}>
            {t('property.notFound') || "Property Not Found"}
          </h1>
          <p className={`text-muted-foreground mb-8 ${dir === 'rtl' ? 'arabic-text' : ''}`}>
            {t('property.notFoundDescription') || "The property you're looking for doesn't exist or has been removed."}
          </p>
          <Button asChild>
            <a href="/" className={dir === 'rtl' ? 'arabic-text' : ''}>
              {t('notFound.returnHome') || "Return Home"}
            </a>
          </Button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    toast({
      title: t('property.savedTitle') || "Property Saved",
      description: t('property.savedDescription') || "This property has been added to your favorites.",
    });
  };

  const handleShare = () => {
    toast({
      title: t('property.shareTitle') || "Share Link Copied",
      description: t('property.shareDescription') || "Property link has been copied to your clipboard.",
    });
  };

  const handleContact = () => {
    toast({
      title: t('property.contactTitle') || "Message Sent",
      description: t('property.contactDescription') || "Your message has been sent to the property owner.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      <div className="container mx-auto px-4 py-8">
        {/* Property Images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2 aspect-video rounded-lg overflow-hidden">
            <img 
              src={property.images[0]} 
              alt={property.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {property.images.slice(1, 5).map((image, index) => (
              <div key={index} className="aspect-square rounded-lg overflow-hidden">
                <img 
                  src={image} 
                  alt={`${property.title} - View ${index + 2}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Property Header */}
        <div className={`flex flex-col md:flex-row justify-between items-start gap-4 mb-6 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <div className={dir === 'rtl' ? 'text-right' : ''}>
            <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
            <div className={`flex items-center text-muted-foreground mb-2 ${dir === 'rtl' ? 'justify-end arabic-text' : ''}`}>
              <MapPinIcon className={`h-4 w-4 ${dir === 'rtl' ? 'ml-1' : 'mr-1'}`} />
              <span>{property.location}</span>
            </div>
            <div className={`flex items-center gap-4 ${dir === 'rtl' ? 'justify-end arabic-text' : ''}`}>
              <span className={`flex items-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <BedDoubleIcon className="h-4 w-4" />
                {property.beds} {t('property.beds')}
              </span>
              <span className={`flex items-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <HomeIcon className="h-4 w-4" />
                {property.type}
              </span>
              {property.yearBuilt && (
                <span className={`flex items-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <CalendarIcon className="h-4 w-4" />
                  {t('property.built') || "Built"} {property.yearBuilt}
                </span>
              )}
            </div>
          </div>
          <div className={`flex flex-col ${dir === 'rtl' ? 'items-start' : 'items-end'}`}>
            <span className="text-3xl font-bold text-primary mb-2">{property.price}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSave}>
                <HeartIcon className={`h-4 w-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                {t('property.save')}
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <ShareIcon className={`h-4 w-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                {t('property.share') || "Share"}
              </Button>
            </div>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        {/* Property Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <h2 className={`text-2xl font-semibold mb-4 ${dir === 'rtl' ? 'text-right arabic-text' : ''}`}>
              {t('property.details') || "Property Details"}
            </h2>
            <p className={`text-muted-foreground mb-6 ${dir === 'rtl' ? 'text-right arabic-text' : ''}`}>
              {property.description}
            </p>
            
            <h3 className={`text-xl font-semibold mb-3 ${dir === 'rtl' ? 'text-right arabic-text' : ''}`}>
              {t('property.features') || "Features & Amenities"}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 mb-6">
              {property.features.map((feature, index) => (
                <div key={index} className={`flex items-center ${dir === 'rtl' ? 'flex-row-reverse justify-end arabic-text' : ''}`}>
                  <div className={`h-2 w-2 rounded-full bg-primary ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            
            {property.additionalDetails && (
              <>
                <h3 className={`text-xl font-semibold mb-3 ${dir === 'rtl' ? 'text-right arabic-text' : ''}`}>
                  {t('property.additionalInfo') || "Additional Information"}
                </h3>
                <p className={`text-muted-foreground mb-6 ${dir === 'rtl' ? 'text-right arabic-text' : ''}`}>
                  {property.additionalDetails}
                </p>
              </>
            )}
          </div>
          
          <div>
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar>
                  <AvatarImage src={property.agent.avatar} />
                  <AvatarFallback>{property.agent.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{property.agent.name}</h3>
                  <p className="text-sm text-muted-foreground">{property.agent.agency}</p>
                </div>
              </div>
              <div className="space-y-4 mb-4">
                <textarea 
                  className={`w-full min-h-[100px] p-3 border rounded-md ${dir === 'rtl' ? 'text-right' : ''}`}
                  placeholder={t('property.contactPlaceholder') || "I'm interested in this property and would like to schedule a viewing."}
                  dir={dir}
                />
                <Button className="w-full" onClick={handleContact}>
                  {t('property.contactAgent') || "Contact Agent"}
                </Button>
              </div>
              <p className={`text-xs text-muted-foreground text-center ${dir === 'rtl' ? 'arabic-text' : ''}`}>
                {t('property.contactDisclaimer') || "Your contact information will be shared with the agent"}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
