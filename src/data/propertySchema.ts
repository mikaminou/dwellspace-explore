import * as z from "zod";

// Define validation schema for each step
export const locationSchema = z.object({
  city: z.string().min(1, "City is required"),
  street_name: z.string().min(1, "Street name is required"),
  location: z.string().optional(),
  postcode: z.string().optional(),
  country: z.string().default("Algeria"),
  postal_code: z.number().optional(),
  longitude: z.number().optional(),
  latitude: z.number().optional(),
});

export const basicInfoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  price: z.string().min(1, "Price is required"),
  description: z.string().optional(),
  currency: z.string().default("DZD"),
  type: z.string().default("apartment"),
  listing_type: z.enum(["sale", "rent"]).default("rent"),
});

export const featuresSchema = z.object({
  beds: z.number().min(0, "Number of beds must be 0 or more"),
  baths: z.number().min(0, "Number of baths must be 0 or more"),
  living_area: z.number().min(0, "Living area must be 0 or more"),
  furnished: z.boolean().default(false),
  parking: z.boolean().default(false),
  plot_area: z.number().optional(),
  amenities: z.array(z.string()).default([]),
});

export const mediaSchema = z.object({
  image: z.any().optional(),
  additionalImages: z.array(z.any()).optional(),
});

// Combine all schemas for the complete form
export const propertySchema = locationSchema
  .merge(basicInfoSchema)
  .merge(featuresSchema)
  .merge(mediaSchema);

export type PropertyFormValues = z.infer<typeof propertySchema>;