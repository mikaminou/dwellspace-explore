import React from 'react';
import { MainNav } from '@/components/MainNav';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search } from 'lucide-react';

const Index = () => {
  const { session } = useAuth();
  const userRole = session?.user?.user_metadata?.role || "buyer";
  const isOwner = userRole === "seller" || userRole === "agent";

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      
      <div className="relative w-full h-[60vh] bg-cover bg-center" style={{ backgroundImage: "url('https://kaebtzbmtozoqvsdojkl.supabase.co/storage/v1/object/sign/herosection/hero.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJoZXJvc2VjdGlvbi9oZXJvLmpwZyIsImlhdCI6MTc0MTk1NDg1OCwiZXhwIjoxNzczNDkwODU4fQ.z1M_K39-pQlH8HgMQpgEaojBgARWnLyKHqHEYA_ErdE')" }}>
        <div className="absolute inset-0 bg-black/40">
          <div className="container mx-auto h-full flex flex-col justify-center items-center text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Dream Home in Algeria</h1>
            <p className="text-xl mb-8">Discover the perfect property with our extensive listings across the country</p>
            
            <div className="w-full max-w-3xl bg-white rounded-lg p-3 shadow-lg">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <Input placeholder="Location" className="w-full" />
                </div>
                <div className="flex-1 flex gap-3">
                  <div className="w-1/2">
                    <select className="w-full h-10 px-3 rounded-md border border-input bg-background">
                      <option>Property Type</option>
                      <option>Apartment</option>
                      <option>House</option>
                      <option>Villa</option>
                      <option>Land</option>
                    </select>
                  </div>
                  <div className="w-1/2">
                    <select className="w-full h-10 px-3 rounded-md border border-input bg-background">
                      <option>Listing Type</option>
                      <option>For Sale</option>
                      <option>For Rent</option>
                    </select>
                  </div>
                </div>
                <Button className="md:w-24 h-10">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              {isOwner && (
                <Button asChild className="bg-orange-500 hover:bg-orange-600">
                  <Link to="/property/create">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    List Your Property
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline" className="bg-white text-black hover:bg-gray-100">
                <Link to="/search">
                  <Search className="mr-2 h-4 w-4" />
                  Browse Listings
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold flex items-center">
            <span className="text-yellow-500 mr-2">★</span> 
            Luxury Properties
          </h2>
          <Button variant="outline" asChild>
            <Link to="/search?category=luxury">View All Luxury</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Property cards would go here */}
        </div>
      </div>
    </div>
  );
};

export default Index;
