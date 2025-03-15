
import { useState, useEffect } from 'react';
import { getAllProperties, searchProperties, getPropertyById } from '@/api';
import { Property } from '@/api/properties';

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllProperties();
      setProperties(data);
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
      const data = await getPropertyById(id);
      return data;
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
      setProperties(data);
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
