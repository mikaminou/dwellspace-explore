
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
      
      const normalizedData = await Promise.all(data.map(async property => {
        let owner = undefined;
        
        if (property.owner_id) {
          // Convert number to string for getAgentById
          owner = await getAgentById(String(property.owner_id));
        }
        
        return {
          ...property,
          featured_image_url: property.featured_image_url || property.image || '',
          gallery_image_urls: property.gallery_image_urls || property.images || [],
          image: property.image || property.featured_image_url || '',
          images: property.images || property.gallery_image_urls || [],
          street_name: property.street_name || property.streetName || '',
          owner: owner || undefined,
          agent: owner || undefined,
          isPremium: property.isPremium || false,
          created_at: String(property.created_at || property.createdAt || ''),
          updated_at: String(property.updated_at || property.updatedAt || '')
        } as unknown as Property;
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
      
      if (propertyData && propertyData.owner_id) {
        // Convert number to string for getAgentById
        const ownerData = await getAgentById(String(propertyData.owner_id));
        if (ownerData) {
          return { 
            ...propertyData, 
            owner: ownerData,
            agent: ownerData,
            featured_image_url: propertyData.featured_image_url || propertyData.image || '',
            gallery_image_urls: propertyData.gallery_image_urls || propertyData.images || [],
            image: propertyData.image || propertyData.featured_image_url || '',
            images: propertyData.images || propertyData.gallery_image_urls || [],
            street_name: propertyData.street_name || propertyData.streetName || '',
            isPremium: propertyData.isPremium || false,
            created_at: String(propertyData.created_at || propertyData.createdAt || ''),
            updated_at: String(propertyData.updated_at || propertyData.updatedAt || '')
          } as unknown as Property;
        }
      }
      
      return propertyData ? {
        ...propertyData,
        featured_image_url: propertyData.featured_image_url || propertyData.image || '',
        gallery_image_urls: propertyData.gallery_image_urls || propertyData.images || [],
        image: propertyData.image || propertyData.featured_image_url || '',
        images: propertyData.images || propertyData.gallery_image_urls || [],
        street_name: propertyData.street_name || propertyData.streetName || '',
        isPremium: propertyData.isPremium || false,
        created_at: String(propertyData.created_at || propertyData.createdAt || ''),
        updated_at: String(propertyData.updated_at || propertyData.updatedAt || '')
      } as unknown as Property : null;
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
      propertyType?: string[];
      city?: string[];
      minPrice?: number;
      maxPrice?: number;
      minBeds?: number;
      minLivingArea?: number;
      maxLivingArea?: number;
      features?: string[];
      listingType?: string[];
    } = {}
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchProperties(searchTerm, filters);
      
      const normalizedData = await Promise.all(data.map(async property => {
        let owner = undefined;
        
        if (property.owner_id) {
          // Convert number to string for getAgentById
          owner = await getAgentById(String(property.owner_id));
        }
        
        return {
          ...property,
          featured_image_url: property.featured_image_url || property.image || '',
          gallery_image_urls: property.gallery_image_urls || property.images || [],
          image: property.image || property.featured_image_url || '',
          images: property.images || property.gallery_image_urls || [],
          street_name: property.street_name || property.streetName || '',
          owner: owner || undefined,
          agent: owner || undefined,
          isPremium: property.isPremium || false,
          created_at: String(property.created_at || property.createdAt || ''),
          updated_at: String(property.updated_at || property.updatedAt || '')
        } as unknown as Property;
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
