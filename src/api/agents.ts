
import { supabase } from "@/integrations/supabase/client";

export type Agent = {
  id: string;
  name: string;
  avatar: string | null;
  phone: string | null;
  email: string | null;
  agency: string;
  created_at: string;
  updated_at: string;
};

// Function to get all agents
export const getAllAgents = async (): Promise<Agent[]> => {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*');

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
      .from('agents')
      .select('*')
      .eq('id', id)
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

// Function to get agents for a list of properties
export const getAgentsForProperties = async (propertyIds: number[]): Promise<{[key: number]: Agent}> => {
  if (propertyIds.length === 0) return {};

  try {
    // First get the owner_ids for properties with owner_type = 'agent'
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select('id, owner_id, owner_type')
      .in('id', propertyIds)
      .eq('owner_type', 'agent');

    if (propertiesError || !properties) {
      console.error('Error fetching property-agent relationships:', propertiesError);
      return {};
    }

    // Extract unique agent ids
    const agentIds = properties.reduce((ids: string[], property) => {
      if (property.owner_id && !ids.includes(property.owner_id)) {
        ids.push(property.owner_id);
      }
      return ids;
    }, []);
    
    if (agentIds.length === 0) return {};

    // Fetch all these agents
    const { data: agents, error: agentsError } = await supabase
      .from('agents')
      .select('*')
      .in('id', agentIds);

    if (agentsError || !agents) {
      console.error('Error fetching agents:', agentsError);
      return {};
    }

    // Create a map of agent_id to agent
    const agentMap: {[key: string]: Agent} = {};
    agents.forEach((agent: Agent) => {
      agentMap[agent.id] = agent;
    });

    // Finally, create a map of property_id to agent
    const propertyAgentMap: {[key: number]: Agent} = {};
    properties.forEach((property) => {
      if (property.owner_id && agentMap[property.owner_id]) {
        propertyAgentMap[property.id] = agentMap[property.owner_id];
      }
    });

    return propertyAgentMap;
  } catch (error) {
    console.error('Unexpected error fetching agents for properties:', error);
    return {};
  }
};
