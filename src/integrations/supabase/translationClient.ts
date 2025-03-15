
import { supabase } from './client';

export const useTranslatedSupabase = () => {
  // Return the regular supabase client without translation functionality
  return {
    from: (table: string) => ({
      select: async (columns: string = '*', options?: any) => {
        try {
          const result = await (supabase
            .from(table as any)
            .select(columns, options) as any);
            
          return result;
        } catch (error) {
          console.error(`Error in select from ${table}:`, error);
          return { data: [], error };
        }
      },
      
      insert: async (values: any, options?: any) => {
        try {
          const result = await (supabase
            .from(table as any)
            .insert(values, options) as any);
            
          return result;
        } catch (error) {
          console.error(`Error in insert to ${table}:`, error);
          return { data: null, error };
        }
      },
      
      update: async (values: any, options?: any) => {
        try {
          const result = await (supabase
            .from(table as any)
            .update(values, options) as any);
            
          return result;
        } catch (error) {
          console.error(`Error in update to ${table}:`, error);
          return { data: null, error };
        }
      },
      
      delete: async (options?: any) => {
        try {
          const result = await (supabase
            .from(table as any)
            .delete(options) as any);
            
          return result;
        } catch (error) {
          console.error(`Error in delete from ${table}:`, error);
          return { data: null, error };
        }
      },
      
      // Additional methods with proper error handling
      eq: async (column: string, value: any) => {
        try {
          const result = await (supabase
            .from(table as any)
            .select('*')
            .eq(column, value) as any);
            
          return result;
        } catch (error) {
          console.error(`Error in eq query on ${table}:`, error);
          return { data: [], error };
        }
      },
      
      gt: async (column: string, value: any) => {
        try {
          const result = await (supabase
            .from(table as any)
            .select('*')
            .gt(column, value) as any);
            
          return result;
        } catch (error) {
          console.error(`Error in gt query on ${table}:`, error);
          return { data: [], error };
        }
      },
      
      lt: async (column: string, value: any) => {
        try {
          const result = await (supabase
            .from(table as any)
            .select('*')
            .lt(column, value) as any);
            
          return result;
        } catch (error) {
          console.error(`Error in lt query on ${table}:`, error);
          return { data: [], error };
        }
      },
    }),
    
    rpc: async (fn: string, params?: any) => {
      try {
        const result = await (supabase.rpc as any)(fn, params);
        return result;
      } catch (error) {
        console.error(`Error in rpc call to ${fn}:`, error);
        return { data: null, error };
      }
    },
    
    storage: {
      from: (bucket: string) => supabase.storage.from(bucket),
    },
    
    auth: supabase.auth,
  };
};
