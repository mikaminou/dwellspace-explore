
import { supabase } from './client';
import { useLanguage } from '@/contexts/language/LanguageContext';

export const useTranslatedSupabase = () => {
  const { translateData } = useLanguage();

  // Create wrapped Supabase methods that automatically translate returned data
  return {
    from: (table: string) => ({
      select: async (columns: string = '*', options?: any) => {
        const { data, error } = await supabase
          .from(table)
          .select(columns, options);
          
        if (error) throw error;
        return { data: await translateData(data), error };
      },
      
      // Add other query methods as needed
      insert: async (values: any, options?: any) => {
        const result = await supabase
          .from(table)
          .insert(values, options);
          
        return result;
      },
      
      update: async (values: any, options?: any) => {
        const result = await supabase
          .from(table)
          .update(values, options);
          
        return result;
      },
    }),
    
    rpc: async (fn: string, params?: any) => {
      const { data, error } = await supabase.rpc(fn, params);
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
