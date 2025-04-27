import { useState, useEffect } from 'react';
import { propertyService, Property } from '@/api/properties';
import { profilesService } from '@/api/profiles';
import { propertyDetailsService } from '@/api/propertyDetails';
import { propertyLocationService } from '@/api/propertyLocations';
import { propertyMediaService } from '@/api/propertyMedia';
import { propertyAmenitiesService } from '@/api/propertyAmenities';
import { mapPropertyData } from '@/utils/propertyMapper';

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all properties with related data
  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await propertyService.getAllProperties();

      const normalizedData = await Promise.all(
        data.map(async (property) => {
          const [owner, agent, details, location, media, amenities] = await Promise.all([
            property.owner_id ? profilesService.getProfileById(property.owner_id) : null,
            propertyDetailsService.getDetailsByPropertyId(property.id),
            propertyLocationService.getLocationByPropertyId(property.id),
            propertyMediaService.getMediaByPropertyId(property.id),
            propertyAmenitiesService.getAmenitiesByPropertyId(property.id),
          ]);

          return mapPropertyData(
            {
              ...property,
              details,
              location,
              media,
              amenities,
            },
          );
        })
      );

      setProperties(normalizedData);
    } catch (err: any) {
      console.error('Error fetching properties:', err);
      setError(err.message || 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single property by ID with related data
  const fetchPropertyById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const property = await propertyService.getPropertyById(id);

      if (!property) return null;

      const [owner, agent, details, location, media, amenities] = await Promise.all([
        property.owner_id ? profilesService.getProfileById(property.owner_id) : null,
        propertyDetailsService.getDetailsByPropertyId(property.id),
        propertyLocationService.getLocationByPropertyId(property.id),
        propertyMediaService.getMediaByPropertyId(property.id),
        propertyAmenitiesService.getAmenitiesByPropertyId(property.id),
      ]);

      return mapPropertyData(
        {
          ...property,
          details,
          location,
          media,
          amenities,
        },
      );
    } catch (err: any) {
      console.error(`Error fetching property with ID ${id}:`, err);
      setError(err.message || `Failed to fetch property with ID ${id}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Search properties with filters and related data
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

      const normalizedData = await Promise.all(
        data.map(async (property) => {
          const [owner, agent, details, location, media, amenities] = await Promise.all([
            property.owner_id ? profilesService.getProfileById(property.owner_id) : null,
            property.agent_id ? profilesService.getProfileById(property.agent_id) : null,
            propertyDetailsService.getDetailsByPropertyId(property.id),
            propertyLocationService.getLocationByPropertyId(property.id),
            propertyMediaService.getMediaByPropertyId(property.id),
            propertyAmenitiesService.getAmenitiesByPropertyId(property.id),
          ]);

          return mapPropertyData(
            {
              ...property,
              details,
              location,
              media,
              amenities,
            },
          );
        })
      );

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
    search,
  };
}