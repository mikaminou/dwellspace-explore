
// Define property data types
export interface Agent {
  name: string;
  avatar: string;
  phone?: string;
  email?: string;
  agency: string;
}

export interface Property {
  id: number;
  title: string;
  price: string;
  location: string;
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
}

// Sample agents
const agents = [
  {
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80",
    phone: "555-123-4567",
    email: "sarah.j@realestate.com",
    agency: "Prime Properties"
  },
  {
    name: "Michael Rodriguez",
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80",
    phone: "555-987-6543",
    email: "michael.r@dwellspace.com",
    agency: "DwellSpace Realty"
  },
  {
    name: "Jessica Chen",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80",
    phone: "555-222-3333",
    email: "jessicac@homes.com",
    agency: "Urban Living"
  }
];

// Sample properties data
export const properties: Property[] = [
  {
    id: 1,
    title: "Modern Downtown Apartment",
    price: "$450,000",
    location: "Downtown, City",
    beds: 2,
    baths: 2,
    area: 1200,
    type: "Apartment",
    description: "A beautiful modern apartment in the heart of downtown with stunning city views. This 2-bedroom, 2-bathroom unit features high ceilings, hardwood floors, and an open floor plan perfect for entertaining. The kitchen is equipped with high-end appliances and granite countertops. The primary bedroom has a walk-in closet and ensuite bathroom with a soaking tub and separate shower.",
    yearBuilt: 2018,
    features: [
      "Hardwood floors",
      "Stainless steel appliances",
      "Granite countertops",
      "Central air conditioning",
      "In-unit laundry",
      "Balcony",
      "Gym access",
      "24/7 security"
    ],
    additionalDetails: "HOA fees: $350/month. Includes water, trash, gym access, and building maintenance.",
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
    title: "Suburban Family Home",
    price: "$750,000",
    location: "Suburbia, City",
    beds: 4,
    baths: 3,
    area: 2500,
    type: "House",
    description: "This spacious family home in a quiet suburban neighborhood is perfect for growing families. The 4-bedroom, 3-bathroom house offers plenty of space for everyone, with a large backyard, updated kitchen, and cozy family room with a fireplace. The primary suite is located on the main floor with three additional bedrooms upstairs. The finished basement provides additional living space.",
    yearBuilt: 2005,
    features: [
      "Finished basement",
      "Two-car garage",
      "Fenced backyard",
      "Fireplace",
      "Updated kitchen",
      "Hardwood floors",
      "Central heating and cooling",
      "Patio"
    ],
    additionalDetails: "Property taxes: $5,200/year. Close to top-rated schools and parks.",
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
    title: "Luxury Penthouse",
    price: "$1,200,000",
    location: "City Center",
    beds: 3,
    baths: 3.5,
    area: 2800,
    type: "Penthouse",
    description: "Experience luxurious urban living in this stunning penthouse apartment with panoramic city views. This exclusive 3-bedroom, 3.5-bathroom residence features floor-to-ceiling windows, custom finishes, and a spacious private terrace. The gourmet kitchen includes top-of-the-line appliances and a large island. The primary suite offers a spa-like bathroom and generous walk-in closet.",
    yearBuilt: 2020,
    features: [
      "Private terrace",
      "Floor-to-ceiling windows",
      "Smart home technology",
      "Wine cellar",
      "Concierge service",
      "Valet parking",
      "Indoor pool",
      "Private elevator"
    ],
    additionalDetails: "HOA fees: $1,200/month. Includes 24/7 concierge, valet parking, pool, and gym access.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80"
    ],
    agent: agents[2]
  },
  {
    id: 4,
    title: "Cozy Studio Apartment",
    price: "$235,000",
    location: "University District, City",
    beds: 1,
    baths: 1,
    area: 550,
    type: "Apartment",
    description: "Perfect starter home or investment property in the vibrant University District. This well-designed studio apartment makes efficient use of space with a modern kitchen, updated bathroom, and built-in storage solutions. The building offers excellent amenities including a rooftop lounge, fitness center, and study rooms.",
    yearBuilt: 2015,
    features: [
      "Built-in storage",
      "Rooftop lounge access",
      "Fitness center",
      "Study rooms",
      "Bike storage",
      "Energy efficient appliances",
      "Pet friendly",
      "High-speed internet included"
    ],
    additionalDetails: "HOA fees: $250/month. Walking distance to university, restaurants, and shops.",
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
    title: "Waterfront Condo",
    price: "$825,000",
    location: "Harbor District, City",
    beds: 2,
    baths: 2,
    area: 1500,
    type: "Condo",
    description: "Enjoy breathtaking water views from this luxurious waterfront condo. This 2-bedroom, 2-bathroom residence features an open floor plan with high-end finishes, a gourmet kitchen, and a private balcony overlooking the harbor. The building offers premium amenities including a pool, hot tub, fitness center, and 24-hour security.",
    yearBuilt: 2017,
    features: [
      "Waterfront views",
      "Private balcony",
      "Pool and hot tub",
      "Fitness center",
      "Secure parking",
      "Guest suite",
      "Storage unit",
      "Concierge services"
    ],
    additionalDetails: "HOA fees: $650/month. Steps from the marina, restaurants, and waterfront park.",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560185009-dddeb820c7b7?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab8e17a5?auto=format&fit=crop&q=80"
    ],
    agent: agents[1]
  },
  {
    id: 6,
    title: "Historic Brownstone",
    price: "$920,000",
    location: "Heritage District, City",
    beds: 3,
    baths: 2.5,
    area: 2200,
    type: "House",
    description: "This beautifully restored brownstone in the historic Heritage District combines classic architecture with modern comfort. The 3-bedroom, 2.5-bathroom home features original hardwood floors, crown molding, and a wood-burning fireplace. Updates include a chef's kitchen, spa-like bathrooms, and a landscaped garden with a patio.",
    yearBuilt: 1905,
    features: [
      "Original architectural details",
      "Chef's kitchen",
      "Wood-burning fireplace",
      "Garden with patio",
      "Updated electrical and plumbing",
      "High ceilings",
      "Bay windows",
      "Wine cellar"
    ],
    additionalDetails: "Property taxes: $7,800/year. Historic district with preservation benefits available.",
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
    title: "Mountain View Retreat",
    price: "$680,000",
    location: "Mountainside, City",
    beds: 3,
    baths: 2,
    area: 1800,
    type: "House",
    description: "Escape the city in this tranquil mountain retreat with panoramic views. This 3-bedroom, 2-bathroom home sits on 2 acres of land and features vaulted ceilings, large windows, and a wraparound deck perfect for enjoying the natural surroundings. The open floor plan includes a spacious living area with a stone fireplace and a modern kitchen.",
    yearBuilt: 2010,
    features: [
      "2 acres of land",
      "Wraparound deck",
      "Stone fireplace",
      "Mountain views",
      "Open floor plan",
      "Hiking trails nearby",
      "Off-grid capabilities",
      "Spring water source"
    ],
    additionalDetails: "Property taxes: $4,200/year. 30-minute drive to downtown, 15 minutes to skiing.",
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
    title: "Urban Loft Conversion",
    price: "$550,000",
    location: "Arts District, City",
    beds: 2,
    baths: 2,
    area: 1650,
    type: "Loft",
    description: "Converted from a historic factory, this stylish urban loft offers open living spaces with character. The 2-bedroom, 2-bathroom residence features 14-foot ceilings, exposed brick walls, original timber beams, and large factory windows. The open kitchen includes custom cabinetry and a large island. The primary bedroom has a walk-in closet and ensuite bathroom.",
    yearBuilt: 1925,
    features: [
      "Exposed brick walls",
      "14-foot ceilings",
      "Original timber beams",
      "Factory windows",
      "Custom kitchen",
      "Polished concrete floors",
      "Open floor plan",
      "Secured parking"
    ],
    additionalDetails: "HOA fees: $420/month. Located in the vibrant Arts District with galleries, cafes, and boutiques.",
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
    title: "Smart Home Villa",
    price: "$1,450,000",
    location: "Tech Valley, City",
    beds: 5,
    baths: 4,
    area: 3800,
    type: "House",
    description: "This state-of-the-art smart home combines luxury living with cutting-edge technology. The 5-bedroom, 4-bathroom villa features integrated home automation controlling lighting, climate, security, and entertainment systems. The property includes a home theater, gourmet kitchen, home office, and resort-style backyard with a pool and outdoor kitchen.",
    yearBuilt: 2022,
    features: [
      "Home automation system",
      "Home theater",
      "Pool and spa",
      "Outdoor kitchen",
      "Electric car charging",
      "Solar power system",
      "Home office",
      "Security system"
    ],
    additionalDetails: "Property taxes: $12,500/year. Energy-efficient design with LEED certification.",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80"
    ],
    agent: agents[2]
  }
];
