// Define property data types
export interface Agent {
  name: string;
  avatar: string;
  phone?: string;
  email?: string;
  agency: string;
  role?: string; // Added role field to fix type errors
}

export interface Property {
  id: number;
  title: string;
  price: string;
  location: string;
  city: string;
  streetName?: string;
  street_name?: string; // Added to match API naming
  beds: number;
  baths?: number;
  livingArea?: number;
  plotArea?: number;
  living_area?: number; // Added to match API naming
  plot_area?: number; // Added to match API naming
  type: string;
  listingType: string;
  listing_type?: string; // Added to match API naming
  description: string;
  yearBuilt?: number;
  year_built?: number; // Added to match API naming
  features: string[];
  additionalDetails?: string;
  additional_details?: string; // Added to match API naming
  featuredImageUrl: string; // ✅ Match API naming
  galleryImageUrls: string[]; // ✅ Match API naming
  featured_image_url?: string; // Added to match API naming
  gallery_image_urls?: string[]; // Added to match API naming
  image?: string; // Optional field
  images?: string[]; // ✅ Match API naming
  agent?: Agent;
  isPremium?: boolean;
  longitude: number;
  latitude: number;
  postalCode?: number; // Make optional if API allows null values
  postal_code?: number; // Added to match API naming
  ownerId: number;
  owner_id?: number; // Added to match API naming
  updatedAt: number;
  createdAt: number;
  updated_at?: string; // Added to match API naming
  created_at?: string; // Added to match API naming
}
