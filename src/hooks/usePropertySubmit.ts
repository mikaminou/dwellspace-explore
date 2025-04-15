import { propertyService } from "@/api/properties";
import { PropertyFormValues } from "@/data/propertySchema";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function usePropertySubmit(id?: string) {
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: PropertyFormValues) => {
    setIsSaving(true);
    try {
      const { image, additionalImages, ...propertyData } = data;

      // Handle main image upload
      let mainImageUrl = typeof image === 'string' ? image : '';
      if (image instanceof File) {
        mainImageUrl = await propertyService.uploadImage(image, "main");
      }

      // Handle additional images upload
      const additionalImageUrls = additionalImages
        ? await Promise.all(
            (additionalImages as (File | string)[]).map(file => {
              if (file instanceof File) {
                return propertyService.uploadImage(file, "additional");
              }
              return Promise.resolve(file); // If it's already a URL, return as is
            })
          )
        : [];

      const finalPropertyData: Partial<PropertyFormValues> = {
        ...propertyData,
        image: mainImageUrl,
        additionalImages: additionalImageUrls.length > 0 ? additionalImageUrls : undefined,
      };

      if (id) {
        // Update existing property
        const updatedProperty = await propertyService.updateProperty(parseInt(id, 10), finalPropertyData);
        if (updatedProperty) {
          toast.success("Property updated successfully");
          navigate(`/properties/${id}`);
        } else {
          throw new Error("Failed to update property");
        }
      } else {
        // Create new property
        const newProperty = await propertyService.createProperty(finalPropertyData);
        if (newProperty) {
          toast.success("Property created successfully");
          navigate(`/properties/${newProperty.id}`);
        } else {
          throw new Error("Failed to create property");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while saving the property");
    } finally {
      setIsSaving(false);
    }
  };

  return { onSubmit, isSaving };
}