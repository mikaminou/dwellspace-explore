
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchIcon, MapPinIcon, BedDoubleIcon, HomeIcon, FilterIcon } from "lucide-react";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { searchProperties } from "@/api";
import { Property } from "@/api/properties";

export default function Search() {
  const { t, dir } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState<string>("any");
  const [selectedCity, setSelectedCity] = useState<string>("any");
  const [listingType, setListingType] = useState<string>("any");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000000);
  const [minBeds, setMinBeds] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [features, setFeatures] = useState({
    parking: false,
    furnished: false,
    pool: false,
    garden: false,
    security: false,
    petFriendly: false,
  });
  const [properties, setProperties] = useState<Property[]>([]);
  const [cities, setCities] = useState<string[]>(['any']);
  const [loading, setLoading] = useState(true);

  // Define property types explicitly
  const propertyTypes = [
    { value: "any", label: t('search.anyPropertyType') },
    { value: "Villa", label: t('search.villa') },
    { value: "Apartment", label: t('search.apartment') },
    { value: "House", label: t('search.house') || "House" },
    { value: "Land", label: t('search.land') || "Land" },
    { value: "Studio", label: t('search.studio') },
    { value: "Duplex", label: t('search.duplex') },
    { value: "Traditional House", label: t('search.traditionalHouse') },
    { value: "Loft", label: t('search.loft') },
    { value: "Chalet", label: t('search.chalet') }
  ];

  // Define listing types
  const listingTypes = [
    { value: "any", label: t('search.anyListingType') || "Any Type" },
    { value: "sale", label: t('search.forSale') || "For Sale" },
    { value: "rent", label: t('search.forRent') || "For Rent" },
    { value: "construction", label: t('search.underConstruction') || "Under Construction" }
  ];

  // Fetch properties and extract cities on component mount
  useEffect(() => {
    const fetchAllProperties = async () => {
      setLoading(true);
      try {
        const allProperties = await searchProperties();
        setProperties(allProperties);
        
        // Extract unique cities
        const uniqueCities = ['any', ...Array.from(new Set(allProperties.map(p => p.city)))];
        setCities(uniqueCities);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProperties();
  }, []);

  // Handle search with filters
  const handleSearch = async () => {
    setLoading(true);
    try {
      // Convert selected features to array
      const selectedFeatures = Object.entries(features)
        .filter(([_, selected]) => selected)
        .map(([feature]) => {
          switch (feature) {
            case 'parking': return 'parking';
            case 'furnished': return 'furnished';
            case 'pool': return 'pool';
            case 'garden': return 'garden';
            case 'security': return 'security';
            case 'petFriendly': return 'pet';
            default: return feature;
          }
        });

      const filteredProperties = await searchProperties(searchTerm, {
        propertyType: propertyType !== 'any' ? propertyType : undefined,
        city: selectedCity !== 'any' ? selectedCity : undefined,
        minPrice,
        maxPrice,
        minBeds: minBeds > 0 ? minBeds : undefined,
        features: selectedFeatures.length > 0 ? selectedFeatures : undefined,
        listingType: listingType !== 'any' ? listingType as 'sale' | 'rent' | 'construction' : undefined
      });
      
      setProperties(filteredProperties);
    } catch (error) {
      console.error('Error searching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle feature checkbox changes
  const handleFeatureChange = (feature: keyof typeof features) => {
    setFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  // Reset all filters
  const resetFilters = async () => {
    setSearchTerm("");
    setPropertyType("any");
    setSelectedCity("any");
    setListingType("any");
    setMinPrice(0);
    setMaxPrice(50000000);
    setMinBeds(0);
    setFeatures({
      parking: false,
      furnished: false,
      pool: false,
      garden: false,
      security: false,
      petFriendly: false,
    });
    
    // Fetch all properties again
    setLoading(true);
    try {
      const allProperties = await searchProperties();
      setProperties(allProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center mb-8 gap-4">
          <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input 
              className={`pl-10 ${dir === 'rtl' ? 'arabic-text' : ''}`} 
              placeholder={t('search.placeholder')} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
          </div>
          <Button 
            variant="outline" 
            className={`whitespace-nowrap ${dir === 'rtl' ? 'arabic-text' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FilterIcon className={`${dir === 'rtl' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
            {showFilters ? t('search.hideFilters') : t('search.showFilters')}
          </Button>
          <Button onClick={handleSearch}>
            {t('search.search')}
          </Button>
        </div>
        
        {showFilters && (
          <div className="bg-muted p-4 rounded-lg mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className={`text-sm font-medium mb-2 block ${dir === 'rtl' ? 'arabic-text' : ''}`}>
                {t('search.propertyType')}
              </label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className={dir === 'rtl' ? 'arabic-text' : ''}>
                  <SelectValue placeholder={t('search.anyPropertyType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {propertyTypes.map((type) => (
                      <SelectItem 
                        key={type.value} 
                        value={type.value} 
                        className={dir === 'rtl' ? 'arabic-text' : ''}
                      >
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            {/* New Listing Type Filter */}
            <div>
              <label className={`text-sm font-medium mb-2 block ${dir === 'rtl' ? 'arabic-text' : ''}`}>
                {t('search.listingType') || 'Listing Type'}
              </label>
              <Select value={listingType} onValueChange={setListingType}>
                <SelectTrigger className={dir === 'rtl' ? 'arabic-text' : ''}>
                  <SelectValue placeholder={t('search.anyListingType') || 'Any Type'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {listingTypes.map((type) => (
                      <SelectItem 
                        key={type.value} 
                        value={type.value} 
                        className={dir === 'rtl' ? 'arabic-text' : ''}
                      >
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className={`text-sm font-medium mb-2 block ${dir === 'rtl' ? 'arabic-text' : ''}`}>
                {t('search.city')}
              </label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className={dir === 'rtl' ? 'arabic-text' : ''}>
                  <SelectValue placeholder={t('search.anyCity')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {cities.map(city => (
                      <SelectItem key={city} value={city} className={dir === 'rtl' ? 'arabic-text' : ''}>
                        {city === "any" ? t('search.anyCity') : city}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className={`text-sm font-medium mb-2 block ${dir === 'rtl' ? 'arabic-text' : ''}`}>
                {t('search.priceRange')}
              </label>
              <div className="flex items-center justify-between mb-2">
                <span className={dir === 'rtl' ? 'arabic-text' : ''}>{minPrice.toLocaleString()} DZD</span>
                <span className={dir === 'rtl' ? 'arabic-text' : ''}>{maxPrice.toLocaleString()} DZD</span>
              </div>
              <Slider 
                min={0} 
                max={50000000} 
                step={500000} 
                value={[minPrice, maxPrice]}
                onValueChange={([min, max]) => {
                  setMinPrice(min);
                  setMaxPrice(max);
                }}
              />
            </div>
            
            <div>
              <label className={`text-sm font-medium mb-2 block ${dir === 'rtl' ? 'arabic-text' : ''}`}>
                {t('search.minimumBedrooms')}
              </label>
              <Select value={minBeds.toString()} onValueChange={(value) => setMinBeds(parseInt(value))}>
                <SelectTrigger className={dir === 'rtl' ? 'arabic-text' : ''}>
                  <SelectValue placeholder={t('search.any')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="0" className={dir === 'rtl' ? 'arabic-text' : ''}>
                      {t('search.any')}
                    </SelectItem>
                    <SelectItem value="1" className={dir === 'rtl' ? 'arabic-text' : ''}>1+</SelectItem>
                    <SelectItem value="2" className={dir === 'rtl' ? 'arabic-text' : ''}>2+</SelectItem>
                    <SelectItem value="3" className={dir === 'rtl' ? 'arabic-text' : ''}>3+</SelectItem>
                    <SelectItem value="4" className={dir === 'rtl' ? 'arabic-text' : ''}>4+</SelectItem>
                    <SelectItem value="5" className={dir === 'rtl' ? 'arabic-text' : ''}>5+</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-2 lg:col-span-4">
              <label className={`text-sm font-medium mb-2 block ${dir === 'rtl' ? 'arabic-text' : ''}`}>
                {t('search.features')}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="parking" 
                    checked={features.parking} 
                    onCheckedChange={() => handleFeatureChange("parking")} 
                  />
                  <label htmlFor="parking" className={dir === 'rtl' ? 'arabic-text mr-2' : ''}>
                    {t('search.parking')}
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="furnished" 
                    checked={features.furnished} 
                    onCheckedChange={() => handleFeatureChange("furnished")} 
                  />
                  <label htmlFor="furnished" className={dir === 'rtl' ? 'arabic-text mr-2' : ''}>
                    {t('search.furnished')}
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="pool" 
                    checked={features.pool} 
                    onCheckedChange={() => handleFeatureChange("pool")} 
                  />
                  <label htmlFor="pool" className={dir === 'rtl' ? 'arabic-text mr-2' : ''}>
                    {t('search.pool')}
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="garden" 
                    checked={features.garden} 
                    onCheckedChange={() => handleFeatureChange("garden")} 
                  />
                  <label htmlFor="garden" className={dir === 'rtl' ? 'arabic-text mr-2' : ''}>
                    {t('search.garden')}
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="security" 
                    checked={features.security} 
                    onCheckedChange={() => handleFeatureChange("security")} 
                  />
                  <label htmlFor="security" className={dir === 'rtl' ? 'arabic-text mr-2' : ''}>
                    {t('search.security')}
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="petFriendly" 
                    checked={features.petFriendly} 
                    onCheckedChange={() => handleFeatureChange("petFriendly")} 
                  />
                  <label htmlFor="petFriendly" className={dir === 'rtl' ? 'arabic-text mr-2' : ''}>
                    {t('search.petFriendly')}
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-4">
          <h1 className={`text-2xl font-bold ${dir === 'rtl' ? 'arabic-text' : ''}`}>
            {loading ? (
              <span>{t('ui.loading')}</span>
            ) : (
              <span>{properties.length} {t('search.propertiesFound')}</span>
            )}
          </h1>
          <Separator className="my-4" />
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-64 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4 border border-t-0 rounded-b-lg">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.length > 0 ? (
              properties.map((property) => (
                <Link 
                  to={`/property/${property.id}`} 
                  key={property.id} 
                  className="property-card group hover:scale-[1.02] transition-all"
                >
                  <div className="relative">
                    <img
                      src={property.featured_image_url || '/placeholder.svg'}
                      alt={property.title}
                      className="h-64 w-full object-cover rounded-t-lg"
                    />
                    {/* Add listing type badge */}
                    <div className={`absolute top-4 left-4 px-2 py-1 text-xs font-semibold rounded-md ${
                      property.listing_type === 'sale' ? 'bg-green-500 text-white' : 
                      property.listing_type === 'rent' ? 'bg-blue-500 text-white' : 
                      'bg-amber-500 text-white'
                    }`}>
                      {property.listing_type === 'sale' ? t('property.forSale') || 'For Sale' : 
                       property.listing_type === 'rent' ? t('property.forRent') || 'For Rent' : 
                       t('property.underConstruction') || 'Under Construction'}
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {t('property.save')}
                    </Button>
                  </div>
                  <div className="p-4 border border-t-0 rounded-b-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`text-lg font-semibold ${dir === 'rtl' ? 'arabic-text' : ''}`}>{property.title}</h3>
                      <span className={`text-primary font-semibold ${dir === 'rtl' ? 'arabic-text' : ''}`}>{property.price}</span>
                    </div>
                    <div className="flex flex-col space-y-1 text-muted-foreground">
                      <span className={`flex items-center gap-1 ${dir === 'rtl' ? 'arabic-text' : ''}`}>
                        <MapPinIcon className="h-4 w-4" />
                        {property.location}
                      </span>
                      <span className={`flex items-center gap-1 ${dir === 'rtl' ? 'arabic-text' : ''}`}>
                        <BedDoubleIcon className="h-4 w-4" />
                        {property.beds} {t('property.beds')}
                      </span>
                      <span className={`flex items-center gap-1 ${dir === 'rtl' ? 'arabic-text' : ''}`}>
                        <HomeIcon className="h-4 w-4" />
                        {property.type}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className={`text-xl font-semibold mb-2 ${dir === 'rtl' ? 'arabic-text' : ''}`}>
                  {t('search.noPropertiesFound')}
                </h3>
                <p className={`text-muted-foreground mb-4 ${dir === 'rtl' ? 'arabic-text' : ''}`}>
                  {t('search.adjustSearchCriteria')}
                </p>
                <Button onClick={resetFilters} className={dir === 'rtl' ? 'arabic-text' : ''}>
                  {t('search.resetFilters')}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
