
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the token hash from the URL query params
    const url = new URL(req.url);
    const tokenHash = url.searchParams.get("token_hash");
    const type = url.searchParams.get("type");
    const email = url.searchParams.get("email");
    
    if (!tokenHash || !type) {
      throw new Error("Missing token_hash or type query parameter");
    }

    // Get the site URL from environment variable or request origin
    const siteUrl = Deno.env.get("SITE_URL") || req.headers.get("origin") || "https://kaebtzbmtozoqvsdojkl.supabase.co";
    
    // Construct the correct redirect URL
    const redirectUrl = `${siteUrl}/email-confirmation?token=${tokenHash}&type=${type}${email ? `&email=${encodeURIComponent(email)}` : ''}`;
    
    console.log("Redirecting to:", redirectUrl);
    
    // Return a redirect response
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        "Location": redirectUrl
      }
    });
  } catch (error) {
    console.error("Error handling custom email verification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  }
};

serve(handler);
