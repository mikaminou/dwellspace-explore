
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kaebtzbmtozoqvsdojkl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthZWJ0emJtdG96b3F2c2RvamtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NzM5NTIsImV4cCI6MjA1NzQ0OTk1Mn0.Q6o77e2NGxGYZ0kuckJfw521QmYQXER2e_cn15q3-bs';

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

// Normalize the data from Supabase to ensure consistent format
export const transformPropertyData = (property: any) => {
  // Extract features from json field (or use empty array if null/undefined)
  const features = property.features ? 
    (typeof property.features === 'string' ? 
      JSON.parse(property.features) : 
      property.features) : 
    [];
  
  // Extract gallery images from json field (or use empty array if null/undefined)
  const galleryImages = property.images ? 
    (typeof property.images === 'string' ? 
      JSON.parse(property.images) : 
      property.images) : 
    [];
  
  // Set default value for listing_type if it doesn't exist in the data
  const listingType = property.listing_type || 'sale';

  return {
    id: property.id,
    title: property.title,
    price: property.price,
    location: property.location,
    city: property.city || '',
    beds: property.beds || 0,
    baths: property.baths || null,
    postal_code: property.postal_code || null,
    living_area: property.living_area || null,
    plot_area: property.plot_area || null,
    type: property.type || 'House',
    description: property.description,
    year_built: property.year_built || null,
    features: Array.isArray(features) ? features : [],
    additional_details: property.additional_details || null,
    featured_image_url: property.image || '',
    gallery_image_urls: Array.isArray(galleryImages) ? galleryImages : [],
    owner_id: property.owner_id,
    created_at: property.created_at,
    updated_at: property.updated_at,
    listing_type: listingType,
    // Add these properties for compatibility with mock data
    image: property.image || '',
    images: galleryImages,
    isPremium: false
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
