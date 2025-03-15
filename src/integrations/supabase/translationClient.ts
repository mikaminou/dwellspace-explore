
import { supabase } from './client';
import { useLanguage } from '@/contexts/language/LanguageContext';

export const useTranslatedSupabase = () => {
  const { currentLanguage } = useLanguage();
  
  // Function to modify select query to include translations
  const selectWithTranslation = (query: any, fields?: string) => {
    // Default to all fields if not specified
    const columns = fields || '*';
    
    // For now, we're just returning the regular query without translation
    // We'll modify this when implementing proper translation support
    return query.select(columns);
  };
  
  return {
    from: (table: string) => ({
      select: async (columns: string = '*', options?: any) => {
        try {
          // Use type assertion to tell TypeScript this is valid
          const result = await (supabase
            .from(table as any)
            .select(columns, options) as any);
            
          return result;
        } catch (error) {
          console.error(`Error in translated select from ${table}:`, error);
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
          console.error(`Error in translated insert to ${table}:`, error);
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
          console.error(`Error in translated update to ${table}:`, error);
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
          console.error(`Error in translated delete from ${table}:`, error);
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
          console.error(`Error in translated eq query on ${table}:`, error);
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
          console.error(`Error in translated gt query on ${table}:`, error);
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
          console.error(`Error in translated lt query on ${table}:`, error);
          return { data: [], error };
        }
      },
    }),
    
    rpc: async (fn: string, params?: any) => {
      try {
        const result = await (supabase.rpc as any)(fn, params);
        return result;
      } catch (error) {
        console.error(`Error in translated rpc call to ${fn}:`, error);
        return { data: null, error };
      }
    },
    
    storage: {
      from: (bucket: string) => supabase.storage.from(bucket),
    },
    
    auth: supabase.auth,
  };
};
