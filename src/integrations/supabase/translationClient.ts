
import { supabase } from './client';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import { GenericSchema } from '@supabase/supabase-js/dist/module/lib/types';

export const useTranslatedSupabase = () => {
  // Return regular Supabase client methods without translation
  return {
    from: (table: string) => ({
      select: async (columns: string = '*', options?: any) => {
        // Use type assertion to tell TypeScript this is valid
        const result = await (supabase
          .from(table as any)
          .select(columns, options) as any);
          
        return result;
      },
      
      insert: async (values: any, options?: any) => {
        const result = await (supabase
          .from(table as any)
          .insert(values, options) as any);
          
        return result;
      },
      
      update: async (values: any, options?: any) => {
        const result = await (supabase
          .from(table as any)
          .update(values, options) as any);
          
        return result;
      },
    }),
    
    rpc: async (fn: string, params?: any) => {
      const result = await (supabase.rpc as any)(fn, params);
      return result;
    },
    
    storage: {
      from: (bucket: string) => supabase.storage.from(bucket),
    },
    
    auth: supabase.auth,
  };
};
