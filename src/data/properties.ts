// Define property data types
export interface Agent {
  name: string;
  avatar: string;
  phone?: string;
  email?: string;
  agency: string;
  role?: string; // Added role field to fix type errors
}

export interface Property {
  id: number;
  title: string;
  price: string;
  location: string;
  city: string;
  beds: number;
  baths?: number;
  area?: number;
  type: string;
  description: string;
  yearBuilt?: number;
  features: string[];
  additionalDetails?: string;
  image?: string;
  images: string[];
  agent: Agent;
  isPremium?: boolean; // Added premium flag for luxury properties
}

// Sample agents
const agents = [
  {
    name: "Amina Benali",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80",
    phone: "0770-123-456",
    email: "amina.b@immobilier.dz",
    agency: "Dar Immobilier",
    role: "agent"
  },
  {
    name: "Karim Daoudi",
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80",
    phone: "0550-987-654",
    email: "karim.d@espace-habitat.dz",
    agency: "Espace Habitat",
    role: "agent"
  },
  {
    name: "Leila Hadj",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80",
    phone: "0661-222-333",
    email: "leila.h@algiers-realty.dz",
    agency: "Algiers Realty",
    role: "agent"
  },
  {
    name: "Mohammed Ali",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80",
    phone: "0770-555-123",
    email: "mohammed.a@properties.dz",
    agency: "Independent",
    role: "seller"
  },
  {
    name: "Farida Khelil",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
    phone: "0550-456-789",
    email: "farida.k@homes.dz",
    agency: "Independent",
    role: "seller"
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
    beds: 3,
    baths: 2,
    area: 120,
    type: "Apartment",
    description: "A beautiful modern apartment in the upscale neighborhood of Hydra with stunning city views. This 3-bedroom, 2-bathroom unit features high ceilings, ceramic floors, and an open floor plan perfect for entertaining. The kitchen is equipped with high-end appliances and granite countertops. The primary bedroom has a walk-in closet and ensuite bathroom.",
    yearBuilt: 2018,
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
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560448204-61dc36dc98c8?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560448204-603b3fc33dcc?auto=format&fit=crop&q=80"
    ],
    agent: agents[0]
  },
  {
    id: 2,
    title: "Family Villa in Dely Ibrahim",
    price: "42,000,000 DZD",
    location: "Dely Ibrahim, Algiers",
    city: "Algiers",
    beds: 5,
    baths: 3,
    area: 280,
    type: "Villa",
    description: "This spacious family villa in the quiet neighborhood of Dely Ibrahim is perfect for growing families. The 5-bedroom, 3-bathroom house offers plenty of space for everyone, with a large garden, updated kitchen, and cozy family room. The primary suite is located on the main floor with four additional bedrooms upstairs. The finished basement provides additional living space.",
    yearBuilt: 2010,
    features: [
      "Finished basement",
      "Two-car garage",
      "Garden",
      "Fireplace",
      "Updated kitchen",
      "Ceramic floors",
      "Central heating and cooling",
      "Terrace"
    ],
    additionalDetails: "Property taxes: 85,000 DZD/year. Close to international schools and shopping centers.",
    image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560185008-a33f5c7b1844?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560185009-5bf9f2849488?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80"
    ],
    agent: agents[1]
  },
  {
    id: 3,
    title: "Luxury Duplex in Bab El Oued",
    price: "26,500,000 DZD",
    location: "Bab El Oued, Algiers",
    city: "Algiers",
    beds: 4,
    baths: 3,
    area: 220,
    type: "Duplex",
    description: "Experience luxurious living in this stunning duplex apartment with Mediterranean sea views. This exclusive 4-bedroom, 3-bathroom residence features floor-to-ceiling windows, custom finishes, and a spacious private terrace. The gourmet kitchen includes top-of-the-line appliances and a large island. The primary suite offers a spa-like bathroom and generous walk-in closet.",
    yearBuilt: 2019,
    features: [
      "Private terrace",
      "Floor-to-ceiling windows",
      "Smart home technology",
      "Wine cellar",
      "Concierge service",
      "Secure parking",
      "Indoor pool",
      "Private elevator"
    ],
    additionalDetails: "Condominium fees: 15,000 DZD/month. Includes 24/7 concierge, secure parking, pool, and gym access.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585412781564-1d987f7333c1?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80"
    ],
    agent: agents[2]
  },
  {
    id: 4,
    title: "Studio Apartment near University",
    price: "6,800,000 DZD",
    location: "Bouzareah, Algiers",
    city: "Algiers",
    beds: 1,
    baths: 1,
    area: 55,
    type: "Studio",
    description: "Perfect starter home or investment property near the University of Algiers. This well-designed studio apartment makes efficient use of space with a modern kitchen, updated bathroom, and built-in storage solutions. The building offers excellent amenities including a rooftop lounge, fitness center, and study rooms.",
    yearBuilt: 2015,
    features: [
      "Built-in storage",
      "Rooftop access",
      "Fitness center",
      "Study rooms",
      "Bike storage",
      "Energy efficient appliances",
      "Pet friendly",
      "High-speed internet included"
    ],
    additionalDetails: "Condominium fees: 5,000 DZD/month. Walking distance to university, cafes, and shops.",
    image: "https://images.unsplash.com/photo-1560448075-31c8aeb47fdd?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1560448075-31c8aeb47fdd?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585412733310-8f982a61ecdc?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1569152811536-fb47aced8409?auto=format&fit=crop&q=80"
    ],
    agent: agents[0]
  },
  {
    id: 5,
    title: "Seafront Apartment in Oran",
    price: "21,500,000 DZD",
    location: "Front de Mer, Oran",
    city: "Oran",
    beds: 3,
    baths: 2,
    area: 135,
    type: "Apartment",
    description: "Enjoy breathtaking Mediterranean views from this luxurious seafront apartment in Oran. This 3-bedroom, 2-bathroom residence features an open floor plan with high-end finishes, a gourmet kitchen, and a private balcony overlooking the sea. The building offers premium amenities including a pool, fitness center, and 24-hour security.",
    yearBuilt: 2017,
    features: [
      "Sea views",
      "Private balcony",
      "Pool",
      "Fitness center",
      "Secure parking",
      "Guest suite",
      "Storage unit",
      "Concierge services"
    ],
    additionalDetails: "Condominium fees: 12,000 DZD/month. Steps from the corniche, restaurants, and waterfront parks.",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560185009-dddeb820c7b7?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600566753355-12c8ab8e17a5?auto=format&fit=crop&q=80"
    ],
    agent: agents[1]
  },
  {
    id: 6,
    title: "Traditional House in Casbah",
    price: "15,800,000 DZD",
    location: "Casbah, Algiers",
    city: "Algiers",
    beds: 4,
    baths: 2,
    area: 190,
    type: "Traditional House",
    description: "This beautifully restored traditional house in the historic Casbah district combines classic Moorish architecture with modern comfort. The 4-bedroom, 2-bathroom home features original zellige tilework, carved wood details, and a central courtyard. Updates include a chef's kitchen, modern bathrooms, and a rooftop terrace with panoramic views of the bay.",
    yearBuilt: 1890,
    features: [
      "Original architectural details",
      "Central courtyard",
      "Zellige tilework",
      "Rooftop terrace",
      "Updated electrical and plumbing",
      "High ceilings",
      "Carved woodwork",
      "Bay views"
    ],
    additionalDetails: "Property taxes: 45,000 DZD/year. Historic district with UNESCO World Heritage status.",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&q=80"
    ],
    agent: agents[2]
  },
  {
    id: 7,
    title: "Mountain View Chalet in Tikjda",
    price: "17,500,000 DZD",
    location: "Tikjda, Bouira",
    city: "Bouira",
    beds: 3,
    baths: 2,
    area: 150,
    type: "Chalet",
    description: "Escape to this tranquil mountain chalet with panoramic views of Djurdjura National Park. This 3-bedroom, 2-bathroom home sits on 1 hectare of land and features wooden interiors, large windows, and a wraparound deck perfect for enjoying the natural surroundings. The open floor plan includes a spacious living area with a stone fireplace and a modern kitchen.",
    yearBuilt: 2012,
    features: [
      "1 hectare of land",
      "Wraparound deck",
      "Stone fireplace",
      "Mountain views",
      "Open floor plan",
      "Hiking trails nearby",
      "Solar power",
      "Natural spring water"
    ],
    additionalDetails: "Property taxes: 40,000 DZD/year. 2-hour drive from Algiers, 15 minutes to skiing in winter.",
    image: "https://images.unsplash.com/photo-1553653924-39b70295f8da?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1553653924-39b70295f8da?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1569152811536-fb47aced8409?auto=format&fit=crop&q=80"
    ],
    agent: agents[0]
  },
  {
    id: 8,
    title: "Renovated Loft in Constantine",
    price: "14,200,000 DZD",
    location: "City Center, Constantine",
    city: "Constantine",
    beds: 2,
    baths: 2,
    area: 145,
    type: "Loft",
    description: "Converted from a historic textile factory, this stylish urban loft offers open living spaces with character in the heart of Constantine. The 2-bedroom, 2-bathroom residence features 4-meter ceilings, exposed stone walls, original arches, and large windows with views of the famous bridges. The open kitchen includes custom cabinetry and a large island. The primary bedroom has a walk-in closet and ensuite bathroom.",
    yearBuilt: 1925,
    features: [
      "Exposed stone walls",
      "4-meter ceilings",
      "Original arches",
      "Large windows",
      "Custom kitchen",
      "Marble floors",
      "Open floor plan",
      "Secured parking"
    ],
    additionalDetails: "Condominium fees: 8,000 DZD/month. Located in the historic center with cafes, shops, and cultural attractions nearby.",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1565183997392-2f6f122e5912?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582037928769-181cf1ea7d92?auto=format&fit=crop&q=80"
    ],
    agent: agents[1]
  },
  {
    id: 9,
    title: "Smart Villa in Setif",
    price: "35,000,000 DZD",
    location: "El Eulma, Setif",
    city: "Setif",
    beds: 6,
    baths: 4,
    area: 320,
    type: "Villa",
    description: "This state-of-the-art smart home combines luxury living with cutting-edge technology. The 6-bedroom, 4-bathroom villa features integrated home automation controlling lighting, climate, security, and entertainment systems. The property includes a home theater, gourmet kitchen, home office, and resort-style garden with a pool and outdoor kitchen.",
    yearBuilt: 2021,
    features: [
      "Home automation system",
      "Home theater",
      "Pool",
      "Outdoor kitchen",
      "Electric car charging",
      "Solar power system",
      "Home office",
      "Advanced security system"
    ],
    additionalDetails: "Property taxes: 90,000 DZD/year. Energy-efficient design with smart water management.",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80"
    ],
    agent: agents[2]
  },
  {
    id: 10,
    title: "Beachfront Villa in Bejaia",
    price: "45,000,000 DZD",
    location: "Tichy, Bejaia",
    city: "Bejaia",
    beds: 4,
    baths: 3,
    area: 240,
    type: "Villa",
    description: "Luxurious beachfront villa with stunning Mediterranean views and private beach access. This spacious 4-bedroom home features high ceilings, marble floors, and expansive windows overlooking the sea. The property includes a private swimming pool, landscaped garden, and outdoor entertainment area perfect for enjoying the coastal climate.",
    yearBuilt: 2017,
    features: [
      "Private beach access",
      "Swimming pool",
      "Marble floors",
      "Smart home system",
      "Solar panels",
      "Outdoor kitchen",
      "Garden",
      "Security system"
    ],
    additionalDetails: "Property taxes: 95,000 DZD/year. Includes a separate guest house and staff quarters.",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80"
    ],
    agent: agents[3], // Seller (Mohammed Ali)
    isPremium: true
  },
  {
    id: 11,
    title: "Restored Riad in Ghardaia",
    price: "22,000,000 DZD",
    location: "Old City, Ghardaia",
    city: "Ghardaia",
    beds: 5,
    baths: 3,
    area: 210,
    type: "Traditional House",
    description: "Beautifully restored traditional riad in the heart of Ghardaia's historic district. This authentic 5-bedroom home maintains its original architectural elements while incorporating modern comforts. The property features a central courtyard with a fountain, rooftop terrace with panoramic views, and original mosaic tilework throughout.",
    yearBuilt: 1870,
    features: [
      "Central courtyard",
      "Rooftop terrace",
      "Original mosaic tilework",
      "Hand-carved wooden doors",
      "Traditional kitchen",
      "Solar water heating",
      "Natural cooling system",
      "Cultural heritage status"
    ],
    additionalDetails: "Property taxes: 40,000 DZD/year. Located in UNESCO World Heritage area.",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600607689526-49a70a23f7d6?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1614622263968-63c34f6b9a76?auto=format&fit=crop&q=80"
    ],
    agent: agents[3], // Seller (Mohammed Ali)
    isPremium: true
  },
  {
    id: 12,
    title: "Desert Eco-House in Timimoun",
    price: "19,500,000 DZD",
    location: "Timimoun Oasis, Adrar",
    city: "Adrar",
    beds: 3,
    baths: 2,
    area: 160,
    type: "Eco-House",
    description: "Sustainable eco-house nestled in the Timimoun Oasis. This innovative 3-bedroom home uses traditional desert architecture combined with modern eco-technology to create a comfortable living environment in the Sahara. Features include natural cooling, solar power, and sustainable water management systems.",
    yearBuilt: 2020,
    features: [
      "Desert garden with native plants",
      "Solar power system",
      "Rainwater harvesting",
      "Natural cooling system",
      "Locally sourced materials",
      "Thermal insulation",
      "Organic garden",
      "Desert views"
    ],
    additionalDetails: "Property taxes: 35,000 DZD/year. Off-grid with complete energy independence.",
    image: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555636222-cae831e670b3?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?auto=format&fit=crop&q=80"
    ],
    agent: agents[4], // Seller (Farida Khelil)
    isPremium: true
  },
  {
    id: 13,
    title: "Waterfront Apartment in Algiers",
    price: "28,200,000 DZD",
    location: "Port of Algiers, Algiers",
    city: "Algiers",
    beds: 3,
    baths: 2,
    area: 140,
    type: "Apartment",
    description: "Exclusive waterfront apartment overlooking the Port of Algiers. This sophisticated 3-bedroom residence offers panoramic views of the Mediterranean and city skyline through floor-to-ceiling windows. The property features designer finishes, a gourmet kitchen, and access to premium building amenities.",
    yearBuilt: 2019,
    features: [
      "Harbor views",
      "Designer kitchen",
      "Marble bathrooms",
      "Building concierge",
      "Fitness center",
      "Private parking",
      "Smart home system",
      "Walking distance to cultural attractions"
    ],
    additionalDetails: "Condominium fees: 18,000 DZD/month. Includes security, building maintenance, and amenities access.",
    image: "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1565183997392-2f6f122e5912?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600566753343-f58d377f534c?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1573552342678-6e8deef13c56?auto=format&fit=crop&q=80"
    ],
    agent: agents[4], // Seller (Farida Khelil)
    isPremium: true
  },
  {
    id: 14,
    title: "Modern Townhouse in Oran",
    price: "16,800,000 DZD",
    location: "New City, Oran",
    city: "Oran",
    beds: 3,
    baths: 2,
    area: 150,
    type: "Townhouse",
    description: "Contemporary townhouse in Oran's developing New City district. This 3-bedroom, 2-bathroom residence offers an urban lifestyle with modern design elements including an open floor plan, high ceilings, and abundant natural light. The property includes a private garden and rooftop terrace.",
    yearBuilt: 2021,
    features: [
      "Private garden",
      "Rooftop terrace",
      "Energy-efficient design",
      "Built-in storage solutions",
      "Home office space",
      "Modern kitchen",
      "Parking space",
      "Community amenities"
    ],
    additionalDetails: "Homeowners association fee: 8,000 DZD/month. 10-minute drive to beaches.",
    image: "https://images.unsplash.com/photo-1571939228382-b2f2b585ce15?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1571939228382-b2f2b585ce15?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80"
    ],
    agent: agents[0], // Agent (Amina Benali)
  },
  {
    id: 15,
    title: "Penthouse in Downtown Constantine",
    price: "31,500,000 DZD",
    location: "City Center, Constantine",
    city: "Constantine",
    beds: 4,
    baths: 3,
    area: 190,
    type: "Penthouse",
    description: "Luxurious penthouse in the heart of Constantine with breathtaking views of the famous bridges and gorges. This 4-bedroom residence occupies the entire top floor and features premium finishes, a wraparound terrace, and floor-to-ceiling windows that showcase the dramatic landscape. The open concept design includes a chef's kitchen, formal dining room, and spacious living areas.",
    yearBuilt: 2018,
    features: [
      "Panoramic city views",
      "Wraparound terrace",
      "Home theater",
      "Wine cellar",
      "Premium appliances",
      "Private elevator access",
      "Smart home technology",
      "Custom lighting"
    ],
    additionalDetails: "Condominium fees: 20,000 DZD/month. Includes dedicated building manager and security.",
    image: "https://images.unsplash.com/photo-1565182999561-18d7dc61c393?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1565182999561-18d7dc61c393?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&q=80"
    ],
    agent: agents[1], // Agent (Karim Daoudi)
    isPremium: true
  },
  {
    id: 16,
    title: "Mountain Retreat in Kabylie",
    price: "18,700,000 DZD",
    location: "Tizi Ouzou, Kabylie",
    city: "Tizi Ouzou",
    beds: 4,
    baths: 2,
    area: 180,
    type: "Mountain House",
    description: "Serene mountain home nestled in the beautiful Kabylie region with stunning views of the Djurdjura mountains. This 4-bedroom retreat combines traditional Kabyle architecture with modern comforts. Features include stone walls, wooden beams, a large fireplace, and spacious outdoor areas designed to take advantage of the natural surroundings.",
    yearBuilt: 2014,
    features: [
      "Mountain views",
      "Fruit orchard",
      "Spring water source",
      "Traditional fireplace",
      "Outdoor dining area",
      "Guest cottage",
      "Hiking trails access",
      "Stone patio"
    ],
    additionalDetails: "Property taxes: 42,000 DZD/year. 1 hectare of land with fruit trees and natural spring.",
    image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1562182384-08115de5ee97?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80"
    ],
    agent: agents[2], // Agent (Leila Hadj)
  },
  {
    id: 17,
    title: "Historical Courtyard Home in Tlemcen",
    price: "23,900,000 DZD",
    location: "Old Medina, Tlemcen",
    city: "Tlemcen",
    beds: 5,
    baths: 3,
    area: 220,
    type: "Traditional House",
    description: "Magnificent historical home in the ancient Medina of Tlemcen. This carefully restored 5-bedroom property exemplifies the rich architectural heritage of the region with its central courtyard, intricate tilework, and carved wooden details. Modern updates include updated plumbing, electrical systems, and a renovated kitchen while preserving the home's authentic character.",
    yearBuilt: 1850,
    features: [
      "Central courtyard with fountain",
      "Authentic zellige tilework",
      "Carved cedar ceilings",
      "Traditional hammam",
      "Interior garden",
      "Modernized utilities",
      "Original architectural details",
      "Rooftop terrace"
    ],
    additionalDetails: "Property taxes: 50,000 DZD/year. Protected historical status with special tax benefits.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600607689593-69e1d1b89a17?auto=format&fit=crop&q=80"
    ],
    agent: agents[1], // Agent (Karim Daoudi)
    isPremium: true
  },
  {
    id: 18,
    title: "Seaside Villa in Annaba",
    price: "38,200,000 DZD",
    location: "Plage Rizi Amor, Annaba",
    city: "Annaba",
    beds: 5,
    baths: 4,
    area: 280,
    type: "Villa",
    description: "Elegant seaside villa on the beautiful coastline of Annaba. This 5-bedroom, 4-bathroom luxury home is set on a 2,000 sq.m. landscaped plot with direct beach access. The property features Mediterranean-inspired architecture with spacious indoor-outdoor living areas, a swimming pool overlooking the sea, and a guest apartment perfect for visitors or staff.",
    yearBuilt: 2016,
    features: [
      "Direct beach access",
      "Infinity pool",
      "Guest apartment",
      "Landscaped gardens",
      "Outdoor entertainment area",
      "Floor-to-ceiling sea views",
      "Home automation system",
      "Summer kitchen"
    ],
    additionalDetails: "Property taxes: 105,000 DZD/year. Includes separate staff quarters and 4-car garage.",
    image: "https://images.unsplash.com/photo-1600566753375-df3b2cb2cec6?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1600566753375-df3b2cb2cec6?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?auto=format&fit=crop&q=80"
    ],
    agent: agents[2], // Agent (Leila Hadj)
    isPremium: true
  },
  {
    id: 19,
    title: "Modern Farm Estate in Blida",
    price: "29,800,000 DZD",
    location: "Chrea Valley, Blida",
    city: "Blida",
    beds: 4,
    baths: 3,
    area: 240,
    type: "Farm Estate",
    description: "Contemporary farm estate nestled in the fertile Chrea Valley of Blida. This 4-bedroom, 3-bathroom property combines modern architecture with rural living on 5 hectares of productive land. The main residence features open living spaces, high ceilings, and large windows that showcase the surrounding mountains and orchards. The property includes established fruit orchards, olive groves, and purpose-built agricultural facilities.",
    yearBuilt: 2015,
    features: [
      "5 hectares of land",
      "Fruit orchards and olive groves",
      "Modern barn and storage",
      "Irrigation system",
      "Solar energy",
      "Mountain views",
      "Guest cottage",
      "Greenhouse"
    ],
    additionalDetails: "Property taxes: 65,000 DZD/year. Income-generating agricultural operation included in sale.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&q=80"
    ],
    agent: agents[0], // Agent (Amina Benali)
  }
];
