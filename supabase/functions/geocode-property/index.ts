
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
    // Parse request body
    const { address, propertyId } = await req.json();
    
    if (!address) {
      return new Response(
        JSON.stringify({ error: 'Address is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Geocode the address
    let coordinates = null;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
        { headers: { 'User-Agent': 'AlgeriaPropertySite/1.0' } }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          coordinates = {
            longitude: parseFloat(data[0].lon),
            latitude: parseFloat(data[0].lat)
          };
        }
      }
    } catch (geocodeError) {
      console.error('Geocoding error:', geocodeError);
    }
    
    // If coordinates were found and propertyId is provided, update the property
    if (coordinates && propertyId) {
      // Create Supabase client
      const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const { error: updateError } = await supabase
        .from('properties')
        .update({
          longitude: coordinates.longitude,
          latitude: coordinates.latitude
        })
        .eq('id', propertyId);
      
      if (updateError) {
        console.error('Error updating property coordinates:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to update property coordinates', details: updateError }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
    }
    
    return new Response(
      JSON.stringify({ 
        coordinates: coordinates || { error: 'Could not geocode address' },
        propertyId,
        address 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in geocode-property function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
