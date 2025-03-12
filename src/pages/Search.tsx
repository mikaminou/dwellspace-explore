
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchIcon, MapPinIcon, BedDoubleIcon, HomeIcon, FilterIcon } from "lucide-react";
import { properties } from "@/data/properties";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState<string>("any");
  const [selectedCity, setSelectedCity] = useState<string>("any");
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

  // Get unique cities from properties data
  const cities = ["any", ...Array.from(new Set(properties.map(property => property.city)))];

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          property.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = propertyType === "any" || property.type.toLowerCase() === propertyType.toLowerCase();
    
    const matchesCity = selectedCity === "any" || property.city === selectedCity;
    
    const price = parseInt(property.price.replace(/[^0-9]/g, ""));
    const matchesPrice = price >= minPrice && price <= maxPrice;
    
    const matchesBeds = property.beds >= minBeds;
    
    let matchesFeatures = true;
    if (features.parking && !property.features.some(f => f.toLowerCase().includes("parking"))) matchesFeatures = false;
    if (features.furnished && !property.features.some(f => f.toLowerCase().includes("furnished"))) matchesFeatures = false;
    if (features.pool && !property.features.some(f => f.toLowerCase().includes("pool"))) matchesFeatures = false;
    if (features.garden && !property.features.some(f => f.toLowerCase().includes("garden"))) matchesFeatures = false;
    if (features.security && !property.features.some(f => f.toLowerCase().includes("security"))) matchesFeatures = false;
    if (features.petFriendly && !property.features.some(f => f.toLowerCase().includes("pet"))) matchesFeatures = false;
    
    return matchesSearch && matchesType && matchesCity && matchesPrice && matchesBeds && matchesFeatures;
  });

  const handleFeatureChange = (feature: keyof typeof features) => {
    setFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center mb-8 gap-4">
          <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input 
              className="pl-10" 
              placeholder="Search by location or property name" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            className="whitespace-nowrap"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FilterIcon className="mr-2 h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>
        
        {showFilters && (
          <div className="bg-muted p-4 rounded-lg mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Property Type</label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger>
                  <SelectValue placeholder="Any property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="any">Any property type</SelectItem>
                    <SelectItem value="Villa">Villa</SelectItem>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="Studio">Studio</SelectItem>
                    <SelectItem value="Duplex">Duplex</SelectItem>
                    <SelectItem value="Traditional House">Traditional House</SelectItem>
                    <SelectItem value="Loft">Loft</SelectItem>
                    <SelectItem value="Chalet">Chalet</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">City</label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Any city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>
                        {city === "any" ? "Any city" : city}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Price Range (DZD)</label>
              <div className="flex items-center justify-between mb-2">
                <span>{minPrice.toLocaleString()} DZD</span>
                <span>{maxPrice.toLocaleString()} DZD</span>
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
              <label className="text-sm font-medium mb-2 block">Minimum Bedrooms</label>
              <Select value={minBeds.toString()} onValueChange={(value) => setMinBeds(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="0">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-2 lg:col-span-4">
              <label className="text-sm font-medium mb-2 block">Features</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="parking" 
                    checked={features.parking} 
                    onCheckedChange={() => handleFeatureChange("parking")} 
                  />
                  <label htmlFor="parking">Parking</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="furnished" 
                    checked={features.furnished} 
                    onCheckedChange={() => handleFeatureChange("furnished")} 
                  />
                  <label htmlFor="furnished">Furnished</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="pool" 
                    checked={features.pool} 
                    onCheckedChange={() => handleFeatureChange("pool")} 
                  />
                  <label htmlFor="pool">Pool</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="garden" 
                    checked={features.garden} 
                    onCheckedChange={() => handleFeatureChange("garden")} 
                  />
                  <label htmlFor="garden">Garden</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="security" 
                    checked={features.security} 
                    onCheckedChange={() => handleFeatureChange("security")} 
                  />
                  <label htmlFor="security">Security</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="petFriendly" 
                    checked={features.petFriendly} 
                    onCheckedChange={() => handleFeatureChange("petFriendly")} 
                  />
                  <label htmlFor="petFriendly">Pet Friendly</label>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-4">
          <h1 className="text-2xl font-bold">{filteredProperties.length} Properties Found</h1>
          <Separator className="my-4" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <Link 
                to={`/property/${property.id}`} 
                key={property.id} 
                className="property-card group hover:scale-[1.02] transition-all"
              >
                <div className="relative">
                  <img
                    src={property.image || property.images[0]}
                    alt={property.title}
                    className="h-64 w-full object-cover rounded-t-lg"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Save
                  </Button>
                </div>
                <div className="p-4 border border-t-0 rounded-b-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{property.title}</h3>
                    <span className="text-primary font-semibold">{property.price}</span>
                  </div>
                  <div className="flex flex-col space-y-1 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPinIcon className="h-4 w-4" />
                      {property.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <BedDoubleIcon className="h-4 w-4" />
                      {property.beds} beds
                    </span>
                    <span className="flex items-center gap-1">
                      <HomeIcon className="h-4 w-4" />
                      {property.type}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No properties found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search criteria to find more properties.</p>
              <Button onClick={() => {
                setSearchTerm("");
                setPropertyType("any");
                setSelectedCity("any");
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
              }}>
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
