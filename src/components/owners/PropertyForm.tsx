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

const propertySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  type: z.string().min(1, "Property type is required"),
  beds: z.number().min(0, "Number of beds must be 0 or more"),
  baths: z.number().min(0, "Number of baths must be 0 or more"),
  living_area: z.number().min(0, "Living area must be 0 or more"),
  plot_area: z.number().optional(),
  location: z.string().min(1, "Location is required"),
  city: z.string().min(1, "City is required"),
  street_name: z.string().min(1, "Street name is required"),
  postal_code: z.number().optional(),
  longitude: z.number().optional(),
  latitude: z.number().optional(),
  listing_type: z.string().min(1, "Listing type is required"),
  features: z.array(z.string()).optional(),
  image: z.string().optional(),
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

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      type: "apartment",
      beds: 0,
      baths: 0,
      living_area: 0,
      location: "",
      city: "",
      street_name: "",
      listing_type: "sale",
      features: [],
    },
  });

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

          // Convert features to string array if needed
          const features = data.features ? 
            (Array.isArray(data.features) ? 
              data.features.map(f => String(f)) : 
              []
            ) : [];

          form.reset({
            title: data.title,
            description: data.description,
            price: data.price,
            type: data.type,
            beds: data.beds,
            baths: data.baths || 0,
            living_area: data.living_area,
            plot_area: data.plot_area || undefined,
            location: data.location,
            city: data.city,
            street_name: data.street_name,
            postal_code: data.postal_code || undefined,
            longitude: data.longitude || undefined,
            latitude: data.latitude || undefined,
            listing_type: data.listing_type,
            features: features,
            image: data.image || "",
          });

          setImageUrl(data.image || "");
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

  const onSubmit = async (values: PropertyFormValues) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to create or edit properties.");
      return;
    }

    try {
      setLoading(true);
      
      // Upload image if a new one is selected
      const imageUrl = await uploadImage();
      
      const propertyData = {
        ...values,
        image: imageUrl,
        owner_id: session.user.id,
        updated_at: new Date().toISOString(),
      };
      
      if (isEditing && id) {
        // Update existing property
        const { error } = await supabase
          .from("properties")
          .update(propertyData)
          .eq("id", parseInt(id));
        
        if (error) throw error;
        
        toast.success("Property updated successfully.");
      } else {
        // Create new property with all required fields
        const newProperty = {
          ...propertyData,
          created_at: new Date().toISOString(),
          // Ensure required fields have non-null values
          beds: propertyData.beds,
          city: propertyData.city,
          description: propertyData.description,
          location: propertyData.location,
          living_area: propertyData.living_area,
          price: propertyData.price,
          street_name: propertyData.street_name,
          title: propertyData.title,
          type: propertyData.type
        };
        
        const { error } = await supabase
          .from("properties")
          .insert([newProperty]);
        
        if (error) throw error;
        
        toast.success("Property created successfully.");
      }
      
      // Navigate back to dashboard
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error saving property:", error);
      toast.error(error.message || "Failed to save property data.");
    } finally {
      setLoading(false);
    }
  };

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
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input placeholder="$1,000,000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                          <SelectItem value="condo">Condo</SelectItem>
                          <SelectItem value="townhouse">Townhouse</SelectItem>
                          <SelectItem value="land">Land</SelectItem>
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
                      <FormLabel>Living Area (sq ft)</FormLabel>
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
              
              <div>
                <FormLabel>Property Image</FormLabel>
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
