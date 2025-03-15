
import { supabase } from "@/integrations/supabase/client";

export type Agent = {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
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

    return data;
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
    // First get the agent_ids for these properties
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select('id, agent_id')
      .in('id', propertyIds);

    if (propertiesError) {
      console.error('Error fetching property-agent relationships:', propertiesError);
      return {};
    }

    // Extract unique agent ids
    const agentIds = [...new Set(properties.map(p => p.agent_id))];
    
    if (agentIds.length === 0) return {};

    // Fetch all these agents
    const { data: agents, error: agentsError } = await supabase
      .from('agents')
      .select('*')
      .in('id', agentIds);

    if (agentsError) {
      console.error('Error fetching agents:', agentsError);
      return {};
    }

    // Create a map of agent_id to agent
    const agentMap = agents.reduce((acc: {[key: string]: Agent}, agent: Agent) => {
      acc[agent.id] = agent;
      return acc;
    }, {});

    // Finally, create a map of property_id to agent
    return properties.reduce((acc: {[key: number]: Agent}, property: any) => {
      if (agentMap[property.agent_id]) {
        acc[property.id] = agentMap[property.agent_id];
      }
      return acc;
    }, {});
  } catch (error) {
    console.error('Unexpected error fetching agents for properties:', error);
    return {};
  }
};
