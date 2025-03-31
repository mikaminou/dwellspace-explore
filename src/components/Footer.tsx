
import React from "react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-muted/30 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground">Our Story</Link></li>
              <li><Link to="/team" className="text-muted-foreground hover:text-foreground">Team</Link></li>
              <li><Link to="/careers" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
              <li><Link to="/press" className="text-muted-foreground hover:text-foreground">Press</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Properties</h3>
            <ul className="space-y-2">
              <li><Link to="/search?type=sale" className="text-muted-foreground hover:text-foreground">For Sale</Link></li>
              <li><Link to="/search?type=rent" className="text-muted-foreground hover:text-foreground">For Rent</Link></li>
              <li><Link to="/search?type=commercial" className="text-muted-foreground hover:text-foreground">Commercial</Link></li>
              <li><Link to="/map" className="text-muted-foreground hover:text-foreground">Map Search</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
              <li><Link to="/guides" className="text-muted-foreground hover:text-foreground">Buying Guides</Link></li>
              <li><Link to="/mortgage" className="text-muted-foreground hover:text-foreground">Mortgage Calculator</Link></li>
              <li><Link to="/faq" className="text-muted-foreground hover:text-foreground">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact Us</Link></li>
              <li><Link to="/support" className="text-muted-foreground hover:text-foreground">Support</Link></li>
              <li><Link to="/agents" className="text-muted-foreground hover:text-foreground">Find an Agent</Link></li>
              <li><a href="mailto:info@osken.com" className="text-muted-foreground hover:text-foreground">info@osken.com</a></li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Osken Real Estate. All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-4">
            <a href="#" className="text-muted-foreground hover:text-foreground" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground" aria-label="Twitter">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
            <a href="mailto:info@osken.com" className="text-muted-foreground hover:text-foreground" aria-label="Email">
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
