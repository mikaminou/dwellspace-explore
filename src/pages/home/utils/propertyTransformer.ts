
import { Property } from "@/api/properties";

// Function to transform mock data to match the API property type
export const transformMockProperties = (mockProperties: any[]): Property[] => {
  if (!Array.isArray(mockProperties)) {
    console.error("Mock properties is not an array:", mockProperties);
    return [];
  }
  
  return mockProperties.map(mock => {
    if (!mock) {
      console.error("Null or undefined mock property");
      return null;
    }
    
    try {
      return {
        id: mock.id || Math.random().toString(36).substring(7),
        title: mock.title || "Untitled Property",
        price: mock.price || "$0",
        location: mock.location || "",
        city: mock.city || "",
        beds: mock.beds || 0,
        baths: mock.baths || null,
        postal_code: null,
        living_area: mock.area || null,
        plot_area: null,
        type: mock.type || "house",
        description: mock.description || "",
        year_built: mock.yearBuilt || null,
        features: mock.features || [],
        additional_details: mock.additionalDetails || null,
        featured_image_url: mock.image || "",
        gallery_image_urls: mock.images || [],
        owner_id: "00000000-0000-0000-0000-000000000000", // Default owner ID
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        listing_type: 'sale',
        // Add compatibility with mock data
        image: mock.image || "",
        images: mock.images || [],
        isPremium: mock.isPremium || false,
        owner: mock.agent ? {
          id: "00000000-0000-0000-0000-000000000000",
          first_name: mock.agent?.name ? mock.agent.name.split(' ')[0] : "",
          last_name: mock.agent?.name ? (mock.agent.name.split(' ')[1] || "") : "",
          avatar_url: mock.agent?.avatar || "",
          email: mock.agent?.email || "",
          phone_number: mock.agent?.phone || "",
          role: mock.agent?.role || "agent",
          bio: "",
          agency: mock.agent?.agency || "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } : undefined
      };
    } catch (err) {
      console.error("Error transforming mock property:", err, mock);
      return null;
    }
  }).filter(Boolean) as Property[];
};
