
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

// Ensure we use strings for amenities and features
const propertySchema = z.object({
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
  listing_type: z.string().min(1, "Listing type is required"),
  status: z.string().default("available"),
  floor: z.number().optional(),
  total_floors: z.number().optional(),
  parking: z.boolean().default(false),
  furnished: z.boolean().default(false),
  features: z.array(z.string()).optional(),
  image: z.string().optional(),
  year_built: z.number().optional(),
  amenities: z.array(z.string()).default([]),
  rental_period: z.string().optional(),
  security_deposit: z.number().optional(),
  available_from: z.string().optional(),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

export function PropertyForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [additionalImageUrls, setAdditionalImageUrls] = useState<string[]>([]);
  const [isRental, setIsRental] = useState(false);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      currency: "DZD",
      type: "apartment",
      beds: 0,
      baths: 0,
      living_area: 0,
      location: "",
      city: "",
      street_name: "",
      country: "Algeria",
      listing_type: "sale",
      status: "available",
      parking: false,
      furnished: false,
      features: [],
      amenities: [],
    },
  });

  // Watch listing_type to show/hide rental-specific fields
  const watchListingType = form.watch("listing_type");

  useEffect(() => {
    setIsRental(watchListingType === "rent");
  }, [watchListingType]);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!isEditing || !id) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .eq("id", parseInt(id))
          .single();

        if (error) throw error;

        if (data) {
          // Check if the current user is the owner
          if (data.owner_id !== session?.user?.id) {
            toast.error("You do not have permission to edit this property.");
            navigate("/dashboard");
            return;
          }

          // Fetch location details
          const { data: locationData } = await supabase
            .from("property_locations")
            .select("*")
            .eq("property_id", parseInt(id))
            .maybeSingle();

          // Fetch rental details if it's a rental property
          const { data: rentalData } = await supabase
            .from("rental_details")
            .select("*")
            .eq("property_id", parseInt(id))
            .maybeSingle();

          // Fetch media
          const { data: mediaData } = await supabase
            .from("property_media")
            .select("*")
            .eq("property_id", parseInt(id))
            .eq("media_type", "image");

          // Set initial form values
          const formValues: Partial<PropertyFormValues> = {
            title: data.title,
            description: data.description,
            price: data.price,
            currency: data.currency || "DZD",
            type: data.type,
            beds: data.beds,
            baths: data.baths || 0,
            living_area: data.living_area,
            plot_area: data.plot_area || undefined,
            location: data.location,
            city: data.city,
            street_name: data.street_name,
            status: data.status || "available",
            listing_type: data.listing_type,
            floor: data.floor || undefined,
            total_floors: data.total_floors || undefined,
            parking: data.parking || false,
            furnished: data.furnished || false,
            year_built: data.year_built || undefined,
            // Fix: Ensure amenities is properly typed as string[]
            amenities: Array.isArray(data.amenities) 
              ? data.amenities.map(a => String(a)) 
              : [],
            // Fix: Ensure features is properly typed as string[]
            features: Array.isArray(data.features) 
              ? data.features.map(f => String(f)) 
              : [],
            image: data.image || "",
          };

          // Add location data if available
          if (locationData) {
            formValues.state = locationData.state;
            formValues.country = locationData.country;
            // Note: postal_code is not directly in property_locations table
            // We need to handle it differently or add it to the table
            formValues.latitude = locationData.latitude;
            formValues.longitude = locationData.longitude;
          }

          // Add rental data if available
          if (rentalData) {
            formValues.rental_period = rentalData.rental_period;
            formValues.security_deposit = rentalData.security_deposit;
            formValues.available_from = rentalData.available_from 
              ? new Date(rentalData.available_from).toISOString().split('T')[0]
              : undefined;
            setIsRental(true);
          }

          form.reset(formValues);

          // Set image URLs
          setImageUrl(data.image || "");
          
          if (mediaData && mediaData.length > 0) {
            const additionalUrls = mediaData
              .filter(media => !media.is_featured)
              .map(media => media.media_url);
            setAdditionalImageUrls(additionalUrls);
          }
        }
      } catch (error: any) {
        console.error("Error fetching property:", error);
        toast.error(error.message || "Failed to load property data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, isEditing, session, form, navigate]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setImageFile(file);
      
      // Create a preview URL
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const handleAdditionalImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setAdditionalImages(prev => [...prev, ...newFiles]);
      
      // Create preview URLs
      const newUrls = newFiles.map(file => URL.createObjectURL(file));
      setAdditionalImageUrls(prev => [...prev, ...newUrls]);
    }
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
    setAdditionalImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return form.getValues("image") || null;

    try {
      const fileExt = imageFile.name.split('.').pop();
      const filePath = `${session?.user?.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('properties')
        .upload(filePath, imageFile);
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('properties')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Using default image instead.");
      return null;
    }
  };

  const uploadAdditionalImages = async (propertyId: number): Promise<string[]> => {
    if (additionalImages.length === 0) return additionalImageUrls;

    try {
      const uploadPromises = additionalImages.map(async (file, index) => {
        const fileExt = file.name.split('.').pop();
        const filePath = `${session?.user?.id}/${Date.now()}_${index}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('properties')
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('properties')
          .getPublicUrl(filePath);
          
        return data.publicUrl;
      });
      
      const uploadedUrls = await Promise.all(uploadPromises);
      
      // Add to property_media table
      const mediaEntries = uploadedUrls.map(url => ({
        property_id: propertyId,
        media_url: url,
        media_type: 'image',
        is_featured: false
      }));
      
      const { error: mediaError } = await supabase
        .from('property_media')
        .insert(mediaEntries);
      
      if (mediaError) throw mediaError;
      
      return uploadedUrls;
    } catch (error: any) {
      console.error("Error uploading additional images:", error);
      toast.error("Failed to upload some additional images.");
      return [];
    }
  };

  const onSubmit = async (values: PropertyFormValues) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to create or edit properties.");
      return;
    }

    try {
      setLoading(true);
      
      // Upload main image if a new one is selected
      const imageUrl = await uploadImage();
      
      // Prepare property data
      const propertyData = {
        title: values.title,
        description: values.description,
        price: values.price,
        currency: values.currency,
        type: values.type,
        beds: values.beds,
        baths: values.baths,
        living_area: values.living_area,
        plot_area: values.plot_area,
        location: values.location,
        city: values.city,
        street_name: values.street_name,
        listing_type: values.listing_type,
        status: values.status,
        floor: values.floor,
        total_floors: values.total_floors,
        parking: values.parking,
        furnished: values.furnished,
        year_built: values.year_built,
        // Fix: Ensure amenities is properly handled as JSONB
        amenities: values.amenities,
        // Fix: Ensure features is properly handled as JSONB
        features: values.features,
        image: imageUrl,
        owner_id: session.user.id,
        updated_at: new Date().toISOString(),
      };

      let propertyId: number;
      
      if (isEditing && id) {
        // Update existing property
        const { error } = await supabase
          .from("properties")
          .update(propertyData)
          .eq("id", parseInt(id));
        
        if (error) throw error;
        
        propertyId = parseInt(id);
        
        toast.success("Property updated successfully.");
      } else {
        // Create new property
        const newProperty = {
          ...propertyData,
          created_at: new Date().toISOString(),
        };
        
        const { data, error } = await supabase
          .from("properties")
          .insert([newProperty])
          .select();
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
          throw new Error("Failed to create property");
        }
        
        propertyId = data[0].id;
        
        toast.success("Property created successfully.");
      }
      
      // Handle location data
      const locationData = {
        property_id: propertyId,
        address: values.street_name,
        state: values.state,
        country: values.country,
        // postal_code is not directly in property_locations table
        // based on current structure
        latitude: values.latitude,
        longitude: values.longitude,
        updated_at: new Date().toISOString(),
      };
      
      if (isEditing) {
        // Check if location exists
        const { data: existingLocation } = await supabase
          .from("property_locations")
          .select("id")
          .eq("property_id", propertyId)
          .maybeSingle();
        
        if (existingLocation) {
          // Update existing location
          await supabase
            .from("property_locations")
            .update(locationData)
            .eq("property_id", propertyId);
        } else {
          // Insert new location
          await supabase
            .from("property_locations")
            .insert([{ ...locationData, created_at: new Date().toISOString() }]);
        }
      } else {
        // Insert new location
        await supabase
          .from("property_locations")
          .insert([{ ...locationData, created_at: new Date().toISOString() }]);
      }
      
      // Handle rental details if it's a rental
      if (values.listing_type === "rent") {
        const rentalData = {
          property_id: propertyId,
          rental_period: values.rental_period || "monthly",
          security_deposit: values.security_deposit,
          available_from: values.available_from || new Date().toISOString().split('T')[0],
          updated_at: new Date().toISOString(),
        };
        
        if (isEditing) {
          // Check if rental details exist
          const { data: existingRental } = await supabase
            .from("rental_details")
            .select("id")
            .eq("property_id", propertyId)
            .maybeSingle();
          
          if (existingRental) {
            // Update existing rental details
            await supabase
              .from("rental_details")
              .update(rentalData)
              .eq("property_id", propertyId);
          } else {
            // Insert new rental details
            await supabase
              .from("rental_details")
              .insert([{ ...rentalData, created_at: new Date().toISOString() }]);
          }
        } else {
          // Insert new rental details
          await supabase
            .from("rental_details")
            .insert([{ ...rentalData, created_at: new Date().toISOString() }]);
        }
      }
      
      // Handle additional images
      await uploadAdditionalImages(propertyId);
      
      // Navigate back to dashboard
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error saving property:", error);
      toast.error(error.message || "Failed to save property data.");
    } finally {
      setLoading(false);
    }
  };

  const amenityOptions = [
    "Air Conditioning", "Heating", "Balcony", "Pool", "Garden", 
    "Gym", "Elevator", "Parking", "Security System", "Internet",
    "Cable TV", "Washing Machine", "Dishwasher", "Microwave", "Refrigerator"
  ];

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Property" : "Create New Property"}</CardTitle>
          <CardDescription>
            {isEditing 
              ? "Update your property information" 
              : "Fill out the form below to list a new property"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Property title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input placeholder="1,000,000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="DZD">DZD</SelectItem>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select property type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="house">House</SelectItem>
                            <SelectItem value="villa">Villa</SelectItem>
                            <SelectItem value="condo">Condo</SelectItem>
                            <SelectItem value="townhouse">Townhouse</SelectItem>
                            <SelectItem value="land">Land</SelectItem>
                            <SelectItem value="office">Office</SelectItem>
                            <SelectItem value="commercial">Commercial</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="listing_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Listing Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select listing type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="sale">For Sale</SelectItem>
                            <SelectItem value="rent">For Rent</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="sold">Sold</SelectItem>
                            <SelectItem value="rented">Rented</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="year_built"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year Built</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Year"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Property Features</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="beds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bedrooms</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="baths"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bathrooms</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            step="0.5"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="living_area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Living Area (m²)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="plot_area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plot Area (m²)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            placeholder="Optional"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="floor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Floor</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            placeholder="Optional"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="total_floors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Floors</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            placeholder="Optional"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="parking"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Parking Available</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            This property includes parking spaces
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="furnished"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Furnished</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            This property comes furnished
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div>
                  <FormLabel>Amenities</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {amenityOptions.map((amenity) => (
                      <FormField
                        key={amenity}
                        control={form.control}
                        name="amenities"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={amenity}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(amenity)}
                                  onCheckedChange={(checked) => {
                                    const currentAmenities = field.value || [];
                                    return checked
                                      ? field.onChange([...currentAmenities, amenity])
                                      : field.onChange(
                                          currentAmenities.filter(
                                            (value) => value !== amenity
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {amenity}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Location</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="City name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Neighborhood/Area" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="street_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Street address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province</FormLabel>
                        <FormControl>
                          <Input placeholder="State or province" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="postal_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Postal code"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.000001"
                            placeholder="Optional"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.000001"
                            placeholder="Optional"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {isRental && (
                <>
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Rental Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="rental_period"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rental Period</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value || "monthly"}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select period" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="yearly">Yearly</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="security_deposit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Security Deposit</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="0"
                                placeholder="Optional"
                                {...field}
                                value={field.value || ""}
                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="available_from"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Available From</FormLabel>
                            <FormControl>
                              <Input 
                                type="date" 
                                {...field}
                                value={field.value || new Date().toISOString().split('T')[0]}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </>
              )}
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Description</h3>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the property" 
                          rows={5}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Images</h3>
                
                <div>
                  <FormLabel>Main Property Image</FormLabel>
                  <div className="mt-2 flex items-center gap-4">
                    {imageUrl && (
                      <div className="w-24 h-24 rounded overflow-hidden">
                        <img 
                          src={imageUrl} 
                          alt="Property preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
                
                <div>
                  <FormLabel>Additional Images</FormLabel>
                  <div className="mt-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleAdditionalImagesChange}
                      multiple
                    />
                  </div>
                  
                  {additionalImageUrls.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                      {additionalImageUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <div className="aspect-square rounded overflow-hidden">
                            <img 
                              src={url} 
                              alt={`Property preview ${index + 1}`}
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-0 right-0 h-6 w-6 p-0 rounded-full"
                            onClick={() => removeAdditionalImage(index)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : isEditing ? "Update Property" : "Create Property"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
