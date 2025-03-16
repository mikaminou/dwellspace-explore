
import { useEffect, useState } from 'react';
import { Property } from '@/api/properties';
import { getPropertiesWithGeodata } from '@/api/geocoding';
import { toast } from 'sonner';

export function usePropertiesWithOwners(properties: Property[]) {
  const [propertiesWithOwners, setPropertiesWithOwners] = useState<Property[]>(properties || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPropertiesWithGeodata = async () => {
      try {
        setLoading(true);
        // Use the geocoding API to get properties with coordinates
        const geodataProperties = await getPropertiesWithGeodata();
        console.log('Fetched properties with geodata:', geodataProperties.length);
        
        if (geodataProperties.length === 0) {
          toast.warning('No properties with location data found');
        }
        
        // Merge with existing properties if needed
        if (properties && properties.length > 0) {
          // Use map to create a lookup by ID
          const propMap = new Map(
            geodataProperties.map(p => [p.id, p])
          );
          
          // Merge with any properties passed in props
          const mergedProperties = properties.map(prop => {
            const dbProp = propMap.get(prop.id);
            if (dbProp) {
              // If the property exists in both, merge them
              // Prefer coordinates from DB property
              return {
                ...prop,
                longitude: dbProp.longitude || prop.longitude,
                latitude: dbProp.latitude || prop.latitude
              };
            }
            return prop;
          });
          
          setPropertiesWithOwners(mergedProperties);
        } else {
          setPropertiesWithOwners(geodataProperties);
        }
      } catch (error) {
        console.error('Error fetching properties with geodata:', error);
        toast.error('Failed to load property locations');
        // Fallback to passed properties
        setPropertiesWithOwners(properties || []);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we don't already have properties with coordinates
    if (properties) {
      const hasCoordinates = properties.some(p => p.longitude !== undefined && p.latitude !== undefined);
      
      if (!hasCoordinates) {
        console.log('No properties with coordinates found, fetching from API');
        fetchPropertiesWithGeodata();
      } else {
        console.log('Properties already have coordinates, using those');
        setPropertiesWithOwners(properties);
      }
    } else {
      console.log('No properties passed, fetching from API');
      fetchPropertiesWithGeodata();
    }
  }, [properties]);

  return { propertiesWithOwners, loading };
}
