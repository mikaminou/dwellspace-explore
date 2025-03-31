
import React from "react";
import { Search, MapPin, Heart, Home } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: <Search className="h-12 w-12 text-primary" />,
      title: "Search Properties",
      description: "Use our advanced filters to narrow down your perfect property."
    },
    {
      icon: <MapPin className="h-12 w-12 text-primary" />,
      title: "View on Map",
      description: "Explore neighborhoods and property locations in real-time."
    },
    {
      icon: <Heart className="h-12 w-12 text-primary" />,
      title: "Save Favorites",
      description: "Build a collection of properties that catch your eye."
    },
    {
      icon: <Home className="h-12 w-12 text-primary" />,
      title: "Find Your Home",
      description: "Connect with agents and make your dream home a reality."
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-4 p-4 bg-background rounded-full shadow-sm">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
