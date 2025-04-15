import { useState, useEffect } from 'react';
import { propertyService, Property } from '@/api/properties';
import { getAgentById } from '@/api/agents';
import { mapPropertyData } from '@/utils/propertyMapper';

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await propertyService.getAllProperties();
      
      const normalizedData = await Promise.all(data.map(async property => {
        let owner = undefined;
        
        if (property.owner_id) {
          owner = await getAgentById(String(property.owner_id));
        }
        
        return mapPropertyData(property, owner);
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
      const propertyData = await propertyService.getPropertyById(id);
      
      if (propertyData && propertyData.owner_id) {
        const ownerData = await getAgentById(String(propertyData.owner_id));
        return mapPropertyData(propertyData, ownerData);
      }
      
      return propertyData ? mapPropertyData(propertyData) : null;
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
      const data = await propertyService.searchProperties(searchTerm, filters);
      
      const normalizedData = await Promise.all(data.map(async property => {
        let owner = undefined;
        
        if (property.owner_id) {
          owner = await getAgentById(String(property.owner_id));
        }
        
        return mapPropertyData(property, owner);
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