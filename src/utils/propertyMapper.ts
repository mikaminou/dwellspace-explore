import { Property } from '@/api/properties';
import { Agent } from '@/api/agents';

export function mapPropertyData(property: Partial<Property>, owner?: Agent): Property {
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
  } as Property;
}