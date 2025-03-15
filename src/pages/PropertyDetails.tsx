
import React, { useState } from "react";
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
import { LanguageToggle } from "@/components/LanguageToggle";
import { Textarea } from "@/components/ui/textarea";
import { Trans, TransHeading } from "@/components/ui/trans";
import { TranslatableText } from "@/components/ui/TranslatableText";

export default function PropertyDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const property = properties.find((p) => p.id === parseInt(id as string));
  const { t, dir } = useLanguage();
  const [message, setMessage] = useState("");

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <MainNav />
        <div className="container mx-auto px-4 py-16 text-center">
          <TransHeading as="h1" className="text-3xl font-bold mb-4">property.notFound</TransHeading>
          <p className="text-muted-foreground mb-8">
            <Trans>property.notFoundDescription</Trans>
          </p>
          <Button asChild>
            <a href="/">
              <Trans>notFound.returnHome</Trans>
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
                  alt={`${property.title} - ${t('property.view')} ${index + 2}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Property Header */}
        <div className={`flex flex-col md:flex-row justify-between items-start gap-4 mb-6 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <div className={dir === 'rtl' ? 'text-right' : ''}>
            <h1 className="text-3xl font-bold mb-2">
              <TranslatableText originalText={property.title} as="span" />
            </h1>
            <div className={`flex items-center text-muted-foreground mb-2 ${dir === 'rtl' ? 'justify-end arabic-text' : ''}`}>
              <MapPinIcon className={`h-4 w-4 ${dir === 'rtl' ? 'ml-1' : 'mr-1'}`} />
              <TranslatableText originalText={property.location} as="span" />
            </div>
            <div className={`flex items-center gap-4 ${dir === 'rtl' ? 'justify-end arabic-text' : ''}`}>
              <span className={`flex items-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <BedDoubleIcon className="h-4 w-4" />
                {property.beds} <Trans>property.beds</Trans>
              </span>
              <span className={`flex items-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <HomeIcon className="h-4 w-4" />
                <TranslatableText originalText={property.type} as="span" showTranslateButton={false} />
              </span>
              {property.yearBuilt && (
                <span className={`flex items-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <CalendarIcon className="h-4 w-4" />
                  <Trans>property.built</Trans> {property.yearBuilt}
                </span>
              )}
            </div>
          </div>
          <div className={`flex flex-col ${dir === 'rtl' ? 'items-start' : 'items-end'}`}>
            <span className="text-3xl font-bold text-primary mb-2">{property.price}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSave}>
                <HeartIcon className={`h-4 w-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                <Trans>property.save</Trans>
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <ShareIcon className={`h-4 w-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                <Trans>property.share</Trans>
              </Button>
            </div>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        {/* Property Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <TransHeading as="h2" className={`text-2xl font-semibold mb-4 ${dir === 'rtl' ? 'text-right' : ''}`}>
              property.details
            </TransHeading>
            <div className={`mb-6 ${dir === 'rtl' ? 'text-right arabic-text' : ''}`}>
              <TranslatableText originalText={property.description} className="text-muted-foreground" />
            </div>
            
            <TransHeading as="h3" className={`text-xl font-semibold mb-3 ${dir === 'rtl' ? 'text-right' : ''}`}>
              property.features
            </TransHeading>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 mb-6">
              {property.features.map((feature, index) => (
                <div key={index} className={`flex items-center ${dir === 'rtl' ? 'flex-row-reverse justify-end arabic-text' : ''}`}>
                  <div className={`h-2 w-2 rounded-full bg-primary ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                  <TranslatableText originalText={feature} as="span" />
                </div>
              ))}
            </div>
            
            {property.additionalDetails && (
              <>
                <TransHeading as="h3" className={`text-xl font-semibold mb-3 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  property.additionalInfo
                </TransHeading>
                <div className={`mb-6 ${dir === 'rtl' ? 'text-right arabic-text' : ''}`}>
                  <TranslatableText originalText={property.additionalDetails} className="text-muted-foreground" />
                </div>
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
                  <h3 className="font-semibold">
                    <TranslatableText originalText={property.agent.name} as="span" />
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    <TranslatableText originalText={property.agent.agency} as="span" />
                  </p>
                </div>
              </div>
              <div className="space-y-4 mb-4">
                <Textarea 
                  className={`w-full min-h-[100px] p-3 border rounded-md ${dir === 'rtl' ? 'text-right' : ''}`}
                  placeholder="property.contactPlaceholder"
                  translatePlaceholder={true}
                  dir={dir}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button className="w-full" onClick={handleContact}>
                  <Trans>property.contactAgent</Trans>
                </Button>
              </div>
              <p className={`text-xs text-muted-foreground text-center ${dir === 'rtl' ? 'arabic-text' : ''}`}>
                <Trans>property.contactDisclaimer</Trans>
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
