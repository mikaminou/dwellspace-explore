import { supabase } from "@/integrations/supabase/client";
import { Profiles } from "@/integrations/supabase/tables";

// Function to get all agents
export const getAllAgents = async (): Promise<Profiles[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'agent'); // Filter by role 'agent'

    if (error) {
      console.error('Error fetching agents:', error);
      return [];
    }

    // Add the name field derived from first_name and last_name
    return data?.map(agent => ({
      ...agent,
      name: `${agent.first_name || ''} ${agent.last_name || ''}`.trim(),
    })) || [];
  } catch (error) {
    console.error('Unexpected error fetching agents:', error);
    return [];
  }
};

// Function to get an agent by ID
export const getAgentById = async (id: string): Promise<Profiles | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .eq('role', 'agent') // Ensure the role is 'agent'
      .single();

    if (error) {
      console.error(`Error fetching agent with ID ${id}:`, error);
      return null;
    }

    if (data) {
      // Add the name field derived from first_name and last_name
      return {
        ...data,
        name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
      };
    }

    return null;
  } catch (error) {
    console.error(`Unexpected error fetching agent with ID ${id}:`, error);
    return null;
  }
};

// Function to get property owners for a list of properties
export const getOwnersForProperties = async (propertyIds: string[]): Promise<{ [key: string]: Profiles }> => {
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
      .in('role', ['agent', 'seller']); // Filter by roles 'agent' and 'seller'

    if (ownersError || !owners) {
      console.error('Error fetching property owners:', ownersError);
      return {};
    }

    // Create a map of owner_id to profile, adding the name field
    const ownerMap: { [key: string]: Profiles } = {};
    owners.forEach(owner => {
      ownerMap[owner.id] = {
        ...owner,
        name: `${owner.first_name || ''} ${owner.last_name || ''}`.trim(),
      };
    });

    return ownerMap;
  } catch (error) {
    console.error('Unexpected error fetching property owners:', error);
    return {};
  }
};