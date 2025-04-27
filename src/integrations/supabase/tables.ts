
export enum user_role {
    individual = "individual",
    agent = "agent",
    admin = "admin",
}

export enum property_type {
    apartment = "apartment",
    villa = "villa",
    home = "home",
    duplex = "duplex",
    land = "land",
    office = "office",
    commercial = "commercial",
    other = "other",
}

export enum listing_type {
    sell = "sell",
    rent = "rent",
}

export enum listing_status {
    active = "active",
    inactive = "inactive",
    pending = "pending",
}

export interface PropertyDetails {
    id: string;
    property_id: string;
    beds: number;
    baths: number;
    floor?: number;
    total_floors?: number;
    living_area: number;
    plot_area?: number;
    year_built?: number;
    furnished?: boolean;
    parking?: boolean;
}

export interface PropertyLocation {
    id: string;
    property_id: string;
    address: string;
    city: string;
    state?: string;
    country?: string;
    postal_code?: number;
    latitude: number;
    longitude: number;
}

export interface PropertyMedia {
    id: string;
    property_id: string;
    media_url: string;
    media_type: string;
    is_featured: boolean;
}

export interface PropertyAmenities {
    property_id: string;
    amenity_id: string;
}

export interface PropertyFavorites {
    user_id: string;
    property_id: string;
}

export interface PropertyViews {
    id: string;
    user_id: string;
    property_id: string;
    viewed_at: string;
}

export interface Property {
    id: string;
    title: string;
    description?: string;
    type: property_type;
    status: listing_status;
    listingType: listing_type;
    price: number;
    currency: string;
    owner_id: string;
    created_at: string;
    updated_at: string;
}


export interface Amenity {
    id: string;
    name: string;
}

export interface Profiles {
    id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    role: user_role;
    created_at: string;
    updated_at: string;
    email?: string;
    avatar_url?: string;
    bio?: string;
    agency_name?: string;
    license_number?: string;
}

export interface RentalDetails {
    id: string;
    property_id: string;
    rental_period: string;
    security_deposit: number;
    available_from: string;
    created_at: string;
    updated_at: string;
}