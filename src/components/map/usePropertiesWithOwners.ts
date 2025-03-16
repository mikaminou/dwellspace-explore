
import { useState, useEffect } from 'react';
import { Property } from '@/api/properties';
import { getOwnersForProperties } from '@/api/agents';

export function usePropertiesWithOwners(properties: Property[]) {
  const [propertiesWithOwners, setPropertiesWithOwners] = useState<Property[]>([]);

  // Fetch owners for the properties
  useEffect(() => {
    async function fetchOwners() {
      if (properties.length > 0) {
        try {
          const propertyIds = properties.map(p => p.id);
          const ownersMap = await getOwnersForProperties(propertyIds);
          const propertiesWithOwnerData = properties.map(property => ({
            ...property,
            owner: ownersMap[property.id]
          }));
          setPropertiesWithOwners(propertiesWithOwnerData);
        } catch (error) {
          console.error('Error fetching property owners:', error);
          setPropertiesWithOwners(properties);
        }
      } else {
        setPropertiesWithOwners([]);
      }
    }
    
    fetchOwners();
  }, [properties]);

  return { propertiesWithOwners };
}
