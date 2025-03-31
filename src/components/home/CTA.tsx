
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function CTA() {
  return (
    <section className="py-16 bg-primary/10">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Find Your Dream Home?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Start your property search today and discover the perfect place for you and your family.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild>
            <Link to="/search">Start Searching</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/auth">Create Account</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
