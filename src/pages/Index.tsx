
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/MainNav";
import { SearchIcon, MapPinIcon, BedDoubleIcon, HomeIcon, ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { properties } from "@/data/properties";

// Take first 3 properties for featured display
const featuredProperties = properties.slice(0, 3);

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 slide-up">
            Find Your Perfect Space
          </h1>
          <p className="text-xl text-muted-foreground mb-8 slide-up">
            Discover thousands of properties for sale and rent
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center slide-up">
            <Button size="lg" className="font-semibold" asChild>
              <Link to="/search">
                <SearchIcon className="mr-2 h-5 w-5" />
                Search Properties
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="font-semibold">
              List Your Property
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Properties</h2>
          <Button variant="outline" asChild>
            <Link to="/search" className="flex items-center gap-2">
              View All
              <ArrowRightIcon className="h-4 w-4" />
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
                  Save
                </Button>
              </div>
              <div className="property-details">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{property.title}</h3>
                  <span className="text-primary font-semibold">{property.price}</span>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
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
          ))}
        </div>
      </section>
    </div>
  );
}
