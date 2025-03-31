
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <div className="relative py-24 bg-gradient-to-r from-primary/10 to-background overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Find Your Perfect Home
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Discover your dream property with our extensive listings and personalized search tools.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link to="/search">Start Searching</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/map">View Map</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070')] bg-cover bg-center opacity-50 md:opacity-80"></div>
    </div>
  );
}
