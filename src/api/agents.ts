import { supabase } from "@/integrations/supabase/client";

export type Agent = {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  phone_number: string | null;
  email: string | null;
  agency: string | null;
  role: string;
  created_at: string;
  updated_at: string;
};

// Function to get all agents
export const getAllAgents = async (): Promise<Agent[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'agent');

    if (error) {
      console.error('Error fetching agents:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching agents:', error);
    return [];
  }
};

// Function to get an agent by ID
export const getAgentById = async (id: string): Promise<Agent | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .eq('role', 'agent')
      .single();

    if (error) {
      console.error(`Error fetching agent with ID ${id}:`, error);
      return null;
    }

    return data;
  } catch (error) {
    console.error(`Unexpected error fetching agent with ID ${id}:`, error);
    return null;
  }
};

// Function to get property owners for a list of properties
export const getOwnersForProperties = async (propertyIds: number[]): Promise<{[key: number]: Agent}> => {
  if (propertyIds.length === 0) return {};

  try {
    // First get the owner_ids for the properties
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select('id, owner_id')
      .in('id', propertyIds);

    if (propertiesError || !properties) {
      console.error('Error fetching property-owner relationships:', propertiesError);
      return {};
    }

    // Extract unique owner ids
    const ownerIds: string[] = [];
    properties.forEach(property => {
      if (property.owner_id && !ownerIds.includes(property.owner_id)) {
        ownerIds.push(property.owner_id);
      }
    });
    
    if (ownerIds.length === 0) return {};

    // Fetch all profiles (both agents and sellers)
    const { data: owners, error: ownersError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', ownerIds)
      .in('role', ['agent', 'seller']);

    if (ownersError || !owners) {
      console.error('Error fetching property owners:', ownersError);
      return {};
    }

    // Create a map of owner_id to profile
    const ownerMap: {[key: string]: Agent} = {};
    owners.forEach((owner) => {
      ownerMap[owner.id] = owner;
    });

    // Finally, create a map of property_id to owner
    const propertyOwnerMap: {[key: number]: Agent} = {};
    properties.forEach(property => {
      if (property.owner_id && ownerMap[property.owner_id]) {
        propertyOwnerMap[property.id] = ownerMap[property.owner_id];
      }
    });

    return propertyOwnerMap;
  } catch (error) {
    console.error('Unexpected error fetching owners for properties:', error);
    return {};
  }
};
