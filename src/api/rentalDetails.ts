import { supabase } from "@/integrations/supabase/client";
import { Profiles, user_role } from "@/integrations/supabase/tables";

export const profilesService = {
  // Fetch all profiles
  async getAllProfiles(): Promise<Profiles[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching profiles:', error);
      return [];
    }
  },

  // Fetch a profile by ID
  async getProfileById(id: string): Promise<Profiles | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return data || null;
    } catch (error) {
      console.error(`Error fetching profile with ID ${id}:`, error);
      return null;
    }
  },

  // Create a new profile
  async createProfile(profile: Partial<Profiles>): Promise<Profiles | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert(profile)
        .select()
        .single();

      if (error) throw error;

      return data || null;
    } catch (error) {
      console.error('Error creating profile:', error);
      return null;
    }
  },

  // Update an existing profile
  async updateProfile(id: string, profile: Partial<Profiles>): Promise<Profiles | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data || null;
    } catch (error) {
      console.error(`Error updating profile with ID ${id}:`, error);
      return null;
    }
  },

  // Delete a profile by ID
  async deleteProfile(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error(`Error deleting profile with ID ${id}:`, error);
      return false;
    }
  },

  // Fetch all agents
  async getAllAgents(): Promise<Profiles[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', user_role.agent); // Filter by role 'agent'

      if (error) throw error;

      // Add the name field derived from first_name and last_name
      return data?.map(agent => ({
        ...agent,
        name: `${agent.first_name || ''} ${agent.last_name || ''}`.trim(),
      })) || [];
    } catch (error) {
      console.error('Error fetching agents:', error);
      return [];
    }
  },

  // Fetch an agent by ID
  async getAgentById(id: string): Promise<Profiles | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .eq('role', user_role.agent) // Ensure the role is 'agent'
        .single();

      if (error) throw error;

      if (data) {
        // Add the name field derived from first_name and last_name
        return {
          ...data,
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
        };
      }

      return null;
    } catch (error) {
      console.error(`Error fetching agent with ID ${id}:`, error);
      return null;
    }
  },

  // Fetch agents with an agency name
  async getAgentsWithAgency(): Promise<Profiles[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', user_role.agent)
        .not('agency_name', 'is', null); // Ensure the agent has an agency name

      if (error) throw error;

      // Add the name field derived from first_name and last_name
      return data?.map(agent => ({
        ...agent,
        name: `${agent.first_name || ''} ${agent.last_name || ''}`.trim(),
      })) || [];
    } catch (error) {
      console.error('Error fetching agents with agency:', error);
      return [];
    }
  },
};