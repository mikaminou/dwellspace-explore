import * as z from "zod";

export const propertySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  currency: z.string().default("DZD"),
  type: z.string().min(1, "Property type is required"),
  beds: z.number().min(0, "Number of beds must be 0 or more"),
  baths: z.number().min(0, "Number of baths must be 0 or more"),
  living_area: z.number().min(0, "Living area must be 0 or more"),
  plot_area: z.number().optional(),
  location: z.string().min(1, "Location is required"),
  city: z.string().min(1, "City is required"),
  street_name: z.string().min(1, "Street name is required"),
  state: z.string().optional(),
  country: z.string().default("Algeria"),
  postal_code: z.number().optional(),
  longitude: z.number().optional(),
  latitude: z.number().optional(),
  furnished: z.boolean().default(false),
  amenities: z.array(z.string()).default([]),
  listing_type: z.enum(["sale", "rent"]),
  image: z.any().optional(),
  additionalImages: z.array(z.any()).optional(),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;