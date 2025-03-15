
import { supabase } from './client';
import { useLanguage } from '@/contexts/language/LanguageContext';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import { GenericSchema } from '@supabase/supabase-js/dist/module/lib/types';

export const useTranslatedSupabase = () => {
  const { translateData } = useLanguage();

  // Create wrapped Supabase methods that automatically translate returned data
  return {
    from: (table: string) => ({
      select: async (columns: string = '*', options?: any) => {
        // Use type assertion to tell TypeScript this is valid
        const { data, error } = await (supabase
          .from(table as any)
          .select(columns, options) as any);
          
        if (error) throw error;
        return { data: await translateData(data), error };
      },
      
      // Add other query methods as needed
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
      const { data, error } = await supabase.rpc(fn as any, params);
      if (error) throw error;
      return { data: await translateData(data), error };
    },
    
    storage: {
      from: (bucket: string) => supabase.storage.from(bucket),
    },
    
    auth: supabase.auth,
    
    // Add more methods as needed
  };
};
