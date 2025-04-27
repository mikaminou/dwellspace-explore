import { CreatePropertyInput } from "@/api/properties";
import { Profiles, Property } from "@/integrations/supabase/tables";

export function mapPropertyData(property: Partial<CreatePropertyInput>): Property {
  return {
    ...property,
    featured_image_url: property.media || property.image || '',
    gallery_image_urls: property.gallery_image_urls || property.images || [],
    image: property.image || property.featured_image_url || '',
    images: property.images || property.gallery_image_urls || [],
    street_name: property.street_name || '',
    city: property.city || '',
    state: property.state || '',
    country: property.country || '',
    postal_code: property.postal_code || null,
    latitude: property.latitude || null,
    longitude: property.longitude || null,
    owner: owner
      ? {
          id: owner.id,
          name: `${owner.first_name || ''} ${owner.last_name || ''}`.trim(),
          email: owner.email || '',
          phone_number: owner.phone_number || '',
          role: owner.role || null,
        }
      : null,
    agent: agent
      ? {
          id: agent.id,
          name: `${agent.first_name || ''} ${agent.last_name || ''}`.trim(),
          email: agent.email || '',
          phone_number: agent.phone_number || '',
          agency_name: agent.agency_name || '',
          role: agent.role || null,
        }
      : null,
    isPremium: !!property.isPremium, // Ensure boolean value
    created_at: property.created_at || '', // Use consistent naming
    updated_at: property.updated_at || '', // Use consistent naming
  } as Property;
}