
import { supabase } from "@/integrations/supabase/client";

export type Agent = {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  phone_number: string | null;
  email: string | null;
  agency: string | null;
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

// Function to get agents for a list of properties
export const getAgentsForProperties = async (propertyIds: number[]): Promise<{[key: number]: Agent}> => {
  if (propertyIds.length === 0) return {};

  try {
    // First get the agent_ids for the properties
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select('id, agent_id')
      .in('id', propertyIds);

    if (propertiesError || !properties) {
      console.error('Error fetching property-agent relationships:', propertiesError);
      return {};
    }

    // Extract unique agent ids
    const agentIds: string[] = [];
    properties.forEach(property => {
      if (property.agent_id && !agentIds.includes(property.agent_id)) {
        agentIds.push(property.agent_id);
      }
    });
    
    if (agentIds.length === 0) return {};

    // Fetch all agent profiles
    const { data: agents, error: agentsError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', agentIds)
      .eq('role', 'agent');

    if (agentsError || !agents) {
      console.error('Error fetching agents:', agentsError);
      return {};
    }

    // Create a map of agent_id to agent
    const agentMap: {[key: string]: Agent} = {};
    agents.forEach((agent) => {
      agentMap[agent.id] = agent;
    });

    // Finally, create a map of property_id to agent
    const propertyAgentMap: {[key: number]: Agent} = {};
    properties.forEach(property => {
      if (property.agent_id && agentMap[property.agent_id]) {
        propertyAgentMap[property.id] = agentMap[property.agent_id];
      }
    });

    return propertyAgentMap;
  } catch (error) {
    console.error('Unexpected error fetching agents for properties:', error);
    return {};
  }
};
