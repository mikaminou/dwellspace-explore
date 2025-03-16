import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { Property } from '@/data/properties';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kaebtzbmtozoqvsdojkl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthZWJ0emJtdG96b3F2c2RvamtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NzM5NTIsImV4cCI6MjA1NzQ0OTk1Mn0.Q6o77e2NGxGYZ0kuckJfw521QmYQXER2e_cn15q3-bs';

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

export const transformPropertyData = (property: any): Property => {
  return {
    id: property.id,
    title: property.title,
    price: property.price,
    location: property.location,
    city: property.city || '',
    streetName: property.street_name || '',
    beds: property.beds || 0,
    baths: property.baths || null,
    livingArea: property.living_area || null,
    plotArea: property.plot_area || null,
    type: property.type,
    listingType: property.listing_type || 'sale',
    description: property.description,
    yearBuilt: property.year_built || null,
    features: Array.isArray(property.features) ? property.features : [],
    additionalDetails: property.additional_details || null,
    featuredImageUrl: property.featured_image_url || '',
    galleryImageUrls: Array.isArray(property.gallery_image_urls) ? property.gallery_image_urls : [],
    longitude: property.longitude,
    latitude: property.latitude,
    postalCode: property.postal_code || null,
    ownerId: property.owner_id,
    createdAt: property.created_at, // Keep string format
    updatedAt: property.updated_at,
    isPremium: property.isPremium ?? false,
  };
};

// Helper function to get a media URL from Supabase storage
export const getMediaUrl = (bucket: string, path: string): string => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

// Helper function to check if a file exists in storage
export const checkFileExists = async (bucket: string, path: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage.from(bucket).download(path);
    if (error) {
      console.error('Error checking file existence:', error);
      return false;
    }
    return !!data;
  } catch (error) {
    console.error('Unexpected error checking file existence:', error);
    return false;
  }
};

// Create a translations bucket if needed in the future
export const fetchTranslations = async (locale: string) => {
  try {
    // We don't have a translations table yet, so return null or default translations
    console.log(`No translations found for locale: ${locale}, using defaults`);
    return null;
  } catch (error) {
    console.error('Unexpected error fetching translations:', error);
    return null;
  }
};

// Get maximum price from all properties in the database
export const getMaxPropertyPrice = async (): Promise<number> => {
  try {
    // First, fetch all properties to get their prices
    const { data, error } = await supabase
      .from('properties')
      .select('price');

    if (error) {
      console.error('Error fetching property prices:', error);
      return 50000000; // Default fallback
    }

    // Extract numeric values from price strings and find the maximum
    const maxPrice = data.reduce((max, property) => {
      const numericPrice = parseInt(property.price.replace(/[^0-9]/g, ''));
      return !isNaN(numericPrice) && numericPrice > max ? numericPrice : max;
    }, 0);

    // Return max price or default if no valid prices found
    return maxPrice > 0 ? maxPrice : 50000000;
  } catch (error) {
    console.error('Unexpected error getting max property price:', error);
    return 50000000; // Default fallback
  }
};

// Get maximum living area from all properties in the database
export const getMaxLivingArea = async (): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('living_area')
      .order('living_area', { ascending: false })
      .limit(1);

    if (error || !data.length) {
      console.error('Error fetching max living area:', error);
      return 500; // Default fallback
    }

    return data[0].living_area || 500;
  } catch (error) {
    console.error('Unexpected error getting max living area:', error);
    return 500; // Default fallback
  }
};

// Get all unique cities from the database
export const getAllCities = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('city')
      .not('city', 'is', null);

    if (error) {
      console.error('Error fetching cities:', error);
      return [];
    }

    // Extract unique cities
    const uniqueCities = Array.from(
      new Set(
        data
          .map(property => property.city)
          .filter(city => city && city.trim().length > 0)
      )
    );

    return uniqueCities;
  } catch (error) {
    console.error('Unexpected error getting cities:', error);
    return [];
  }
};

// Get the city with the lowest property count
export const getCityWithLowestPropertyCount = async (): Promise<string> => {
  try {
    const { data, error } = await supabase.rpc('get_city_with_lowest_property_count');
    
    if (error) {
      console.error('Error fetching city with lowest property count:', error);
      return 'any';
    }
    
    return data || 'any';
  } catch (error) {
    console.error('Unexpected error getting city with lowest property count:', error);
    return 'any';
  }
};
