
/**
 * API functions for geocoding and property restoration operations
 */

/**
 * Restores properties from backup with geocoding information
 * @returns Object containing restoration statistics
 */
export const restorePropertiesFromBackup = async () => {
  try {
    // Call the Supabase Edge Function to restore properties
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/restore-properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to restore properties');
    }

    // Return the restoration results
    return await response.json();
  } catch (error) {
    console.error('Error in restorePropertiesFromBackup:', error);
    throw error;
  }
};
