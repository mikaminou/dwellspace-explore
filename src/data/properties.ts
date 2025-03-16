// Define property data types
export interface Agent {
  name: string;
  avatar: string;
  phone?: string;
  email?: string;
  agency: string;
  role?: string; // Added role field to fix type errors
  id?: number; // Added id field for compatibility
  first_name?: string; // Added to match API naming
  last_name?: string; // Added to match API naming
  avatar_url?: string; // Added to match API naming
}

export interface Property {
  id: number;
  title: string;
  price: string;
  location: string;
  city: string;
  streetName?: string;
  street_name?: string; // Added to match API naming
  beds: number;
  baths?: number;
  livingArea?: number;
  plotArea?: number;
  living_area?: number; // Added to match API naming
  plot_area?: number; // Added to match API naming
  type: string;
  listingType?: string;
  listing_type: string; // Make this required to match API expectations
  description: string;
  yearBuilt?: number;
  year_built?: number; // Added to match API naming
  features: string[];
  additionalDetails?: string;
  additional_details?: string; // Added to match API naming
  featuredImageUrl?: string; // Match API naming
  galleryImageUrls?: string[]; // Match API naming
  featured_image_url?: string; // Added to match API naming
  gallery_image_urls?: string[]; // Added to match API naming
  image?: string; // Optional field
  images?: string[]; // Match API naming
  agent?: Agent;
  owner?: Agent; // Add owner field to match component usage
  isPremium?: boolean;
  longitude: number;
  latitude: number;
  postalCode?: number; // Make optional if API allows null values
  postal_code?: number; // Added to match API naming
  ownerId?: number;
  owner_id?: number; // Added to match API naming
  updatedAt?: number;
  createdAt?: number;
  updated_at?: string; // Added to match API naming
  created_at?: string; // Added to match API naming
}

// Sample agents
const agents = [
  {
    id: 1,
    name: "Omar Youssef",
    avatar: "/img/agent1.jpg",
    phone: "+213 555 123 456",
    email: "omar.youssef@example.com",
    agency: "Immo El Djazair",
    role: "agent",
    first_name: "Omar",
    last_name: "Youssef",
    avatar_url: "/img/agent1.jpg",
  },
  {
    id: 2,
    name: "Aisha Fatima",
    avatar: "/img/agent2.jpg",
    phone: "+213 777 987 654",
    email: "aisha.fatima@example.com",
    agency: "Dar Al Watan",
    role: "seller",
    first_name: "Aisha",
    last_name: "Fatima",
    avatar_url: "/img/agent2.jpg",
  },
  {
    id: 3,
    name: "Khaled Mustapha",
    avatar: "/img/agent3.jpg",
    phone: "+213 666 246 802",
    email: "khaled.mustapha@example.com",
    agency: "Sakancom",
    role: "agent",
    first_name: "Khaled",
    last_name: "Mustapha",
    avatar_url: "/img/agent3.jpg",
  },
  {
    id: 4,
    name: "Nadia Zahra",
    avatar: "/img/agent4.jpg",
    phone: "+213 555 789 012",
    email: "nadia.zahra@example.com",
    agency: "Beytic",
    role: "buyer",
    first_name: "Nadia",
    last_name: "Zahra",
    avatar_url: "/img/agent4.jpg",
  },
  {
    id: 5,
    name: "Salim Rachid",
    avatar: "/img/agent5.jpg",
    phone: "+213 777 369 258",
    email: "salim.rachid@example.com",
    agency: "Eulma Immo",
    role: "agent",
    first_name: "Salim",
    last_name: "Rachid",
    avatar_url: "/img/agent5.jpg",
  }
];

// Sample properties data with Algerian cities and details
export const properties: Property[] = [
  {
    id: 1,
    title: "Modern Apartment in Hydra",
    price: "18,500,000 DZD",
    location: "Hydra, Algiers",
    city: "Algiers",
    street_name: "12 Rue Hydra",
    streetName: "12 Rue Hydra",
    beds: 3,
    baths: 2,
    livingArea: 120,
    living_area: 120,
    type: "Apartment",
    listingType: "sale",
    listing_type: "sale",
    description: "A beautiful modern apartment in the upscale neighborhood of Hydra with stunning city views. This 3-bedroom, 2-bathroom unit features high ceilings, ceramic floors, and an open floor plan perfect for entertaining. The kitchen is equipped with high-end appliances and granite countertops. The primary bedroom has a walk-in closet and ensuite bathroom.",
    yearBuilt: 2018,
    year_built: 2018,
    features: [
      "Ceramic floors",
      "Built-in wardrobes",
      "Granite countertops",
      "Central air conditioning",
      "Private parking",
      "Balcony",
      "24/7 security",
      "Elevator"
    ],
    additionalDetails: "Condominium fees: 10,000 DZD/month. Includes water, trash, security, and building maintenance.",
    additional_details: "Condominium fees: 10,000 DZD/month. Includes water, trash, security, and building maintenance.",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560448204-61dc36dc98c8?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560448204-603b3fc33dcc?auto=format&fit=crop&q=80"
    ],
    featured_image_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80",
    gallery_image_urls: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560448204-61dc36dc98c8?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560448204-603b3fc33dcc?auto=format&fit=crop&q=80"
    ],
    featuredImageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80",
    galleryImageUrls: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560448204-61dc36dc98c8?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560448204-603b3fc33dcc?auto=format&fit=crop&q=80"
    ],
    agent: agents[0],
    owner: agents[0],
    longitude: 3.05097,
    latitude: 36.7539,
    ownerId: 1,
    owner_id: 1
  },
  {
    id: 2,
    title: "Luxurious Villa in Oran",
    price: "45,000,000 DZD",
    location: "Les Amandiers, Oran",
    city: "Oran",
    street_name: "8 Avenue des Amandiers",
    streetName: "8 Avenue des Amandiers",
    beds: 5,
    baths: 4,
    livingArea: 350,
    living_area: 350,
    type: "Villa",
    listingType: "sale",
    listing_type: "sale",
    description: "An exquisite villa located in the prestigious Les Amandiers neighborhood of Oran. This property boasts a private garden, swimming pool, and panoramic sea views. The interior features marble floors, custom lighting, and designer finishes throughout. The gourmet kitchen is equipped with top-of-the-line appliances and a large center island.",
    yearBuilt: 2015,
    year_built: 2015,
    features: [
      "Swimming pool",
      "Private garden",
      "Sea view",
      "Marble floors",
      "Designer kitchen",
      "Home theater",
      "Gym",
      "Smart home system"
    ],
    additionalDetails: "Annual property taxes: 250,000 DZD. Includes access to community tennis courts and clubhouse.",
    additional_details: "Annual property taxes: 250,000 DZD. Includes access to community tennis courts and clubhouse.",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582467149527-99ca3a8228c4?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571455445348-955c95c94556?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1570129477492-45c003dc7ddf?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571462624294-5664a99d73e1?auto=format&fit=crop&q=80"
    ],
    featured_image_url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80",
    gallery_image_urls: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582467149527-99ca3a8228c4?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571455445348-955c95c94556?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1570129477492-45c003dc7ddf?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571462624294-5664a99d73e1?auto=format&fit=crop&q=80"
    ],
    featuredImageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80",
    galleryImageUrls: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582467149527-99ca3a8228c4?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571455445348-955c95c94556?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1570129477492-45c003dc7ddf?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571462624294-5664a99d73e1?auto=format&fit=crop&q=80"
    ],
    agent: agents[1],
    owner: agents[1],
    longitude: -0.63278,
    latitude: 35.6911,
    ownerId: 2,
    owner_id: 2
  },
  {
    id: 3,
    title: "Charming House in Constantine",
    price: "12,000,000 DZD",
    location: "Cité Daksi, Constantine",
    city: "Constantine",
    street_name: "4 Rue Cité Daksi",
    streetName: "4 Rue Cité Daksi",
    beds: 4,
    baths: 2,
    livingArea: 180,
    living_area: 180,
    type: "House",
    listingType: "sale",
    listing_type: "sale",
    description: "A charming house located in the historic city of Constantine. This property features traditional Algerian architecture with modern amenities. The house includes a courtyard, a rooftop terrace, and a spacious living area. The kitchen is equipped with modern appliances and custom cabinetry.",
    yearBuilt: 1985,
    year_built: 1985,
    features: [
      "Courtyard",
      "Rooftop terrace",
      "Traditional design",
      "Modern kitchen",
      "Fireplace",
      "Air conditioning",
      "Garage",
      "Storage room"
    ],
    additionalDetails: "Recent renovations include new windows, updated electrical system, and fresh paint.",
    additional_details: "Recent renovations include new windows, updated electrical system, and fresh paint.",
    image: "https://images.unsplash.com/photo-1572120360610-d971b9ed9757?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1572120360610-d971b9ed9757?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1564019662420-6c797a589620?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555905794-37ad42301866?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551523851-6865a7979941?auto=format&fit=crop&q=80"
    ],
    featured_image_url: "https://images.unsplash.com/photo-1572120360610-d971b9ed9757?auto=format&fit=crop&q=80",
    gallery_image_urls: [
      "https://images.unsplash.com/photo-1572120360610-d971b9ed9757?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1564019662420-6c797a589620?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555905794-37ad42301866?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551523851-6865a7979941?auto=format&fit=crop&q=80"
    ],
    featuredImageUrl: "https://images.unsplash.com/photo-1572120360610-d971b9ed9757?auto=format&fit=crop&q=80",
    galleryImageUrls: [
      "https://images.unsplash.com/photo-1572120360610-d971b9ed9757?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1564019662420-6c797a589620?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555905794-37ad42301866?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551523851-6865a7979941?auto=format&fit=crop&q=80"
    ],
    agent: agents[2],
    owner: agents[2],
    longitude: 6.61472,
    latitude: 36.3683,
    ownerId: 3,
    owner_id: 3
  },
  {
    id: 4,
    title: "Spacious Apartment in Annaba",
    price: "9,500,000 DZD",
    location: "Vallee de l'Oued, Annaba",
    city: "Annaba",
    street_name: "22 Rue de la Vallee",
    streetName: "22 Rue de la Vallee",
    beds: 2,
    baths: 1,
    livingArea: 90,
    living_area: 90,
    type: "Apartment",
    listingType: "rent",
    listing_type: "rent",
    description: "A spacious apartment available for rent in the desirable Vallee de l'Oued neighborhood of Annaba. This 2-bedroom unit features a modern kitchen, a balcony with city views, and access to a communal garden. The apartment is located close to schools, shops, and public transportation.",
    yearBuilt: 2010,
    year_built: 2010,
    features: [
      "Balcony",
      "City view",
      "Modern kitchen",
      "Communal garden",
      "Parking",
      "Security",
      "Close to schools",
      "Public transportation"
    ],
    additionalDetails: "Monthly rent: 75,000 DZD. Includes water and building maintenance.",
    additional_details: "Monthly rent: 75,000 DZD. Includes water and building maintenance.",
    image: "https://images.unsplash.com/photo-1520236367799-429bf4104385?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1520236367799-429bf4104385?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1516156007624-fd9316ca9247?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505341948064-d273ca7d1843?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505142505310-0991947a301e?auto=format&fit=crop&q=80"
    ],
    featured_image_url: "https://images.unsplash.com/photo-1520236367799-429bf4104385?auto=format&fit=crop&q=80",
    gallery_image_urls: [
      "https://images.unsplash.com/photo-1520236367799-429bf4104385?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1516156007624-fd9316ca9247?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505341948064-d273ca7d1843?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505142505310-0991947a301e?auto=format&fit=crop&q=80"
    ],
    featuredImageUrl: "https://images.unsplash.com/photo-1520236367799-429bf4104385?auto=format&fit=crop&q=80",
    galleryImageUrls: [
      "https://images.unsplash.com/photo-1520236367799-429bf4104385?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1516156007624-fd9316ca9247?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505341948064-d273ca7d1843?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505142505310-0991947a301e?auto=format&fit=crop&q=80"
    ],
    agent: agents[3],
    owner: agents[3],
    longitude: 7.76667,
    latitude: 36.9,
    ownerId: 4,
    owner_id: 4
  },
  {
    id: 5,
    title: "Traditional Riad in Ghardaia",
    price: "15,000,000 DZD",
    location: "El Mizan, Ghardaia",
    city: "Ghardaia",
    street_name: "15 Rue El Mizan",
    streetName: "15 Rue El Mizan",
    beds: 4,
    baths: 3,
    livingArea: 220,
    living_area: 220,
    type: "House",
    listingType: "sale",
    listing_type: "sale",
    description: "A beautifully restored traditional Riad located in the UNESCO World Heritage city of Ghardaia. This property features a central courtyard, intricate mosaic tile work, and hand-carved wooden details. The house includes a spacious living area, a traditional Algerian kitchen, and a rooftop terrace with panoramic views of the city.",
    yearBuilt: 1920,
    year_built: 1920,
    features: [
      "Central courtyard",
      "Mosaic tile work",
      "Hand-carved details",
      "Rooftop terrace",
      "Traditional kitchen",
      "Air conditioning",
      "Storage room",
      "Authentic design"
    ],
    additionalDetails: "This property is a registered historical landmark and is eligible for preservation grants.",
    additional_details: "This property is a registered historical landmark and is eligible for preservation grants.",
    image: "https://images.unsplash.com/photo-1555905794-37ad42301866?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1555905794-37ad42301866?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1549517045-bc93de075e53?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544731612-de7f55e656c9?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541615429-1e9549a99e15?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541474386-449b87892b70?auto=format&fit=crop&q=80"
    ],
    featured_image_url: "https://images.unsplash.com/photo-1555905794-37ad42301866?auto=format&fit=crop&q=80",
    gallery_image_urls: [
      "https://images.unsplash.com/photo-1555905794-37ad42301866?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1549517045-bc93de075e53?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544731612-de7f55e656c9?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541615429-1e9549a99e15?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541474386-449b87892b70?auto=format&fit=crop&q=80"
    ],
    featuredImageUrl: "https://images.unsplash.com/photo-1555905794-37ad42301866?auto=format&fit=crop&q=80",
    galleryImageUrls: [
      "https://images.unsplash.com/photo-1555905794-37ad42301866?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1549517045-bc93de075e53?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544731612-de7f55e656c9?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541615429-1e9549a99e15?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541474386-449b87892b70?auto=format&fit=crop&q=80"
    ],
    agent: agents[4],
    owner: agents[4],
    longitude: 3.11667,
    latitude: 32.4833,
    ownerId: 5,
    owner_id: 5
  },
  {
    id: 6,
    title: "Desert Eco-House in Timimoun",
    price: "22,000,000 DZD",
    location: "Timimoun Oasis, Timimoun",
    city: "Timimoun",
    street_name: "7 Rue de l'Oasis",
    streetName: "7 Rue de l'Oasis",
    beds: 3,
    baths: 2,
    livingArea: 150,
    living_area: 150,
    type: "House",
    listingType: "construction",
    listing_type: "construction",
    description: "A unique eco-friendly house under construction in the beautiful Timimoun Oasis. This property is designed to blend seamlessly with the desert landscape and features sustainable building materials, solar power, and a rainwater harvesting system. The house includes a spacious living area, a modern kitchen, and a private garden with desert views.",
    yearBuilt: 2023,
    year_built: 2023,
    features: [
      "Solar power system",
      "Rainwater harvesting",
      "Desert garden",
      "Sustainable materials",
      "Natural cooling",
      "Energy efficient",
      "Desert views",
      "Eco-friendly design"
    ],
    additionalDetails: "Property taxes: 35,000 DZD/year. Off-grid with complete energy independence.",
    additional_details: "Property taxes: 35,000 DZD/year. Off-grid with complete energy independence.",
    image: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1604014438646-638d3b8c6bf0?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601084881623-cdf9a8ea8c2d?auto=format&fit=crop&q=80"
    ],
    featured_image_url: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?auto=format&fit=crop&q=80",
    gallery_image_urls: [
      "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1604014438646-638d3b8c6bf0?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601084881623-cdf9a8ea8c2d?auto=format&fit=crop&q=80"
    ],
    featuredImageUrl: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?auto=format&fit=crop&q=80",
    galleryImageUrls: [
      "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1604014438646-638d3b8c6bf0?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601084881623-cdf9a8ea8c2d?auto=format&fit=crop&q=80"
    ],
    agent: agents[4],
    owner: agents[4],
    longitude: 0.23333,
    latitude: 29.2667,
    ownerId: 5,
    owner_id: 5
  }
];
