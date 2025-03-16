
// Follow Deno Edge Function pattern from Supabase
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get properties from backup table
    const { data: backupProperties, error: fetchError } = await supabase
      .from('properties_backup')
      .select('*');

    if (fetchError) {
      console.error('Error fetching backup properties:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch backup properties' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    if (!backupProperties || backupProperties.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No backup properties found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    let successCount = 0;
    let errorCount = 0;

    // Process properties in batches to avoid timeouts
    const batchSize = 10;
    for (let i = 0; i < backupProperties.length; i += batchSize) {
      const batch = backupProperties.slice(i, i + batchSize);
      
      // Process each property in the batch
      const processPromises = batch.map(async (property) => {
        try {
          // Geocode the property address to get coordinates
          const address = [
            property.street_name,
            property.city,
            property.postal_code ? String(property.postal_code) : '',
            'Algeria' // Add country for better geocoding results
          ].filter(Boolean).join(', ');
          
          let longitude, latitude;
          
          // Use OpenStreetMap Nominatim API (free, no API key required)
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
              { headers: { 'User-Agent': 'AlgeriaPropertySite/1.0' } }
            );
            
            if (response.ok) {
              const data = await response.json();
              if (data && data.length > 0) {
                longitude = parseFloat(data[0].lon);
                latitude = parseFloat(data[0].lat);
              }
            }
          } catch (geocodeError) {
            console.error(`Geocoding error for property ${property.id}:`, geocodeError);
          }
          
          // If geocoding failed, use city coordinates or defaults
          if (!longitude || !latitude) {
            if (property.city) {
              const cityLower = property.city.toLowerCase();
              // Fallback to predefined city coordinates
              const cityCoordsMap = {
                'algiers': [3.042048, 36.752887],
                'oran': [-0.642049, 35.691544],
                'constantine': [6.614722, 36.365],
                'annaba': [7.765092, 36.897503],
                'setif': [5.408341, 36.190073],
                'tizi ouzou': [4.050, 36.7167],
                'blida': [2.830, 36.4700],
                'tlemcen': [-1.320, 34.8800],
                'bejaia': [5.0833, 36.7500],
                'bouira': [3.900, 36.3800],
                'ghardaia': [3.670, 32.4900],
                'adrar': [-0.290, 27.8700]
              };
              
              for (const [cityName, coords] of Object.entries(cityCoordsMap)) {
                if (cityLower.includes(cityName)) {
                  [longitude, latitude] = coords;
                  break;
                }
              }
            }
            
            // Final fallback to Algiers coordinates
            if (!longitude || !latitude) {
              longitude = 3.042048;
              latitude = 36.752887;
            }
          }
          
          // Wait between geocoding requests to respect rate limits
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Insert the property with coordinates
          const { error: insertError } = await supabase
            .from('properties')
            .insert({
              ...property,
              longitude,
              latitude
            });
          
          if (insertError) {
            console.error(`Error inserting property ${property.id}:`, insertError);
            errorCount++;
          } else {
            successCount++;
          }
        } catch (error) {
          console.error(`Error processing property ${property.id}:`, error);
          errorCount++;
        }
      });
      
      // Wait for all promises in the batch to complete
      await Promise.all(processPromises);
    }

    return new Response(
      JSON.stringify({ 
        message: 'Property restoration completed', 
        total: backupProperties.length,
        success: successCount,
        errors: errorCount
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in restore-properties function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
