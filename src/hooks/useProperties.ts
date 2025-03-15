
import { useState, useEffect } from 'react';
import { getAllProperties, searchProperties, getPropertyById } from '@/api';
import { Property } from '@/api/properties';
import { getAgentById } from '@/api/agents';

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllProperties();
      
      // Ensure all properties have the required fields
      const normalizedData = data.map(property => ({
        ...property,
        // Set fallback values for compatibility with both mock and DB data
        featured_image_url: property.featured_image_url || property.image || '',
        gallery_image_urls: property.gallery_image_urls || property.images || [],
        image: property.image || property.featured_image_url || '',
        images: property.images || property.gallery_image_urls || [],
      }));
      
      setProperties(normalizedData);
    } catch (err: any) {
      console.error('Error fetching properties:', err);
      setError(err.message || 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const fetchPropertyById = async (id: string | number) => {
    setLoading(true);
    setError(null);
    try {
      const propertyData = await getPropertyById(id);
      
      // If property exists and has an owner_id, fetch the owner details
      if (propertyData && propertyData.owner_id) {
        const ownerData = await getAgentById(propertyData.owner_id);
        if (ownerData) {
          // Add the owner data to the property
          return { 
            ...propertyData, 
            owner: ownerData,
            // Set fallback values for compatibility
            featured_image_url: propertyData.featured_image_url || propertyData.image || '',
            gallery_image_urls: propertyData.gallery_image_urls || propertyData.images || [],
            image: propertyData.image || propertyData.featured_image_url || '',
            images: propertyData.images || propertyData.gallery_image_urls || []
          };
        }
      }
      
      return propertyData ? {
        ...propertyData,
        // Set fallback values for compatibility
        featured_image_url: propertyData.featured_image_url || propertyData.image || '',
        gallery_image_urls: propertyData.gallery_image_urls || propertyData.images || [],
        image: propertyData.image || propertyData.featured_image_url || '',
        images: propertyData.images || propertyData.gallery_image_urls || []
      } : null;
    } catch (err: any) {
      console.error(`Error fetching property with ID ${id}:`, err);
      setError(err.message || `Failed to fetch property with ID ${id}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const search = async (
    searchTerm: string = '',
    filters: {
      propertyType?: string;
      city?: string;
      minPrice?: number;
      maxPrice?: number;
      minBeds?: number;
      features?: string[];
    } = {}
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchProperties(searchTerm, filters);
      
      // Normalize the data for consistency
      const normalizedData = data.map(property => ({
        ...property,
        // Set fallback values for compatibility
        featured_image_url: property.featured_image_url || property.image || '',
        gallery_image_urls: property.gallery_image_urls || property.images || [],
        image: property.image || property.featured_image_url || '',
        images: property.images || property.gallery_image_urls || []
      }));
      
      setProperties(normalizedData);
    } catch (err: any) {
      console.error('Error searching properties:', err);
      setError(err.message || 'Failed to search properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return {
    properties,
    loading,
    error,
    fetchProperties,
    fetchPropertyById,
    search
  };
}
