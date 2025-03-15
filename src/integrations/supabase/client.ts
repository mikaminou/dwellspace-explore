
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
    area: property.area || null,
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

// Function to fetch translations
export const fetchTranslations = async (locale: string) => {
  try {
    const { data, error } = await supabase
      .from('translations')
      .select('key, translation')
      .eq('locale', locale);
    
    if (error) {
      console.error('Error fetching translations:', error);
      return null;
    }
    
    if (!data || data.length === 0) {
      console.error(`No translations found for locale: ${locale}`);
      return null;
    }
    
    // Convert array of translations to an object
    const translations = data.reduce((acc: any, item: any) => {
      acc[item.key] = item.translation;
      return acc;
    }, {});
    
    return translations;
  } catch (error) {
    console.error('Unexpected error fetching translations:', error);
    return null;
  }
};
