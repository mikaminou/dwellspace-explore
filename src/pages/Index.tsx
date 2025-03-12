
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/MainNav";
import { SearchIcon, MapPinIcon, BedDoubleIcon, HomeIcon } from "lucide-react";

const featuredProperties = [
  {
    id: 1,
    title: "Modern Downtown Apartment",
    price: "$450,000",
    location: "Downtown, City",
    beds: 2,
    type: "Apartment",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    title: "Suburban Family Home",
    price: "$750,000",
    location: "Suburbia, City",
    beds: 4,
    type: "House",
    image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    title: "Luxury Penthouse",
    price: "$1,200,000",
    location: "City Center",
    beds: 3,
    type: "Penthouse",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80",
  },
];

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
            <Button size="lg" className="font-semibold">
              <SearchIcon className="mr-2 h-5 w-5" />
              Search Properties
            </Button>
            <Button size="lg" variant="outline" className="font-semibold">
              List Your Property
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Featured Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((property) => (
            <div key={property.id} className="property-card fade-in">
              <div className="relative">
                <img
                  src={property.image}
                  alt={property.title}
                  className="property-image"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-4 right-4"
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
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
