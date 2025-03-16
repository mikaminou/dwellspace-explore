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
  beds: number;
  baths?: number;
  livingArea?: number;
  plotArea?: number;
  type: string;
  listingType: string;
  description: string;
  yearBuilt?: number;
  features: string[];
  additionalDetails?: string;
  featuredImageUrl: string; // ✅ Match API naming
  galleryImageUrls: string[]; // ✅ Match API naming
  image?: string; // Optional field
  images?: string[]; // ✅ Match API naming
  agent?: Agent;
  isPremium?: boolean;
  longitude: number;
  latitude: number;
  postalCode?: number; // Make optional if API allows null values
  ownerId: number;
  updatedAt: number;
  createdAt: number;
}
