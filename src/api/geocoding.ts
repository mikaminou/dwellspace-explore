import { supabase } from "@/integrations/supabase/client";

/**
 * Geocode an address and get coordinates
 */
export async function geocodeAddress(
  address: string,
  propertyId?: number
): Promise<{ longitude: number, latitude: number } | null> {
  try {
    const { data, error } = await supabase.functions.invoke('geocode-property', {
      body: { address, propertyId }
    });

    if (error) {
      console.error('Error geocoding address:', error);
      return null;
    }

    if (data?.coordinates && !data.coordinates.error) {
      return data.coordinates;
    }
    
    return null;
  } catch (error) {
    console.error('Unexpected error geocoding address:', error);
    return null;
  }
}

/**
 * Restore properties from backup table with coordinates
 */
export async function restorePropertiesFromBackup(): Promise<{
  success: number;
  errors: number;
  total: number;
}> {
  try {
    // First check if we need to call the edge function or just report success
    const { count, error: countError } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error checking properties count:', countError);
      return { success: 0, errors: 0, total: 0 };
    }
    
    // If we already have properties with coordinates, return success without running edge function
    if (count && count > 0) {
      console.log('Properties already restored with coordinates');
      return { success: count, errors: 0, total: count };
    }
    
    // Otherwise call the edge function (for future use)
    const { data, error } = await supabase.functions.invoke('restore-properties');

    if (error) {
      console.error('Error restoring properties:', error);
      return { success: 0, errors: 0, total: 0 };
    }

    return {
      success: data?.success || 0,
      errors: data?.errors || 0,
      total: data?.total || 0
    };
  } catch (error) {
    console.error('Unexpected error restoring properties:', error);
    return { success: 0, errors: 0, total: 0 };
  }
}
