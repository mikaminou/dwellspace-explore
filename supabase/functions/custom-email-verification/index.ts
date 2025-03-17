
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method === "GET") {
      // Handle GET request for email verification link
      const url = new URL(req.url);
      const tokenHash = url.searchParams.get("token_hash");
      const type = url.searchParams.get("type");
      const email = url.searchParams.get("email");
      const role = url.searchParams.get("role") || "buyer";
      
      if (!tokenHash || !type) {
        throw new Error("Missing token_hash or type query parameter");
      }

      // Get the site URL from environment variable or request origin
      const siteUrl = Deno.env.get("SITE_URL") || req.headers.get("origin") || "https://kaebtzbmtozoqvsdojkl.supabase.co";
      
      // Construct the correct redirect URL with the role parameter
      const redirectUrl = `${siteUrl}/email-confirmation?token=${tokenHash}&type=${type}${email ? `&email=${encodeURIComponent(email)}` : ''}&role=${encodeURIComponent(role)}`;
      
      console.log("Redirecting to:", redirectUrl);
      
      // Return a redirect response
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          "Location": redirectUrl
        }
      });
    } else if (req.method === "POST") {
      // Handle POST request to send custom verification email
      const { email, role } = await req.json();
      
      if (!email) {
        throw new Error("Email is required");
      }
      
      // Make sure we have the Supabase URL and key
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Missing required environment variables");
      }
      
      // The base URL for our site - ideally from environment variable
      const siteUrl = Deno.env.get("SITE_URL") || "https://kaebtzbmtozoqvsdojkl.supabase.co";
      
      // Create a custom redirect URL with role embedded
      const redirectTo = `${siteUrl}/functions/v1/custom-email-verification?role=${encodeURIComponent(role || "buyer")}`;
      
      // Use Supabase Auth API to generate magic link
      const response = await fetch(`${supabaseUrl}/auth/v1/magiclink`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({
          email,
          options: {
            redirectTo
          }
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error("Error sending magic link:", error);
        throw new Error(`Failed to send magic link: ${error.message || "Unknown error"}`);
      }
      
      return new Response(
        JSON.stringify({ success: true, message: "Verification email sent" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }
    
    // If neither GET nor POST, return method not allowed
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
    
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
