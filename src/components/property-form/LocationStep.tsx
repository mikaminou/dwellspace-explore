import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LocationPicker } from "@/components/map/LocationPicker";

interface LocationData {
  city: string;
  state?: string;
  country: string;
  streetName: string;
  location: string;
  longitude?: number;
  latitude?: number;
}

interface LocationStepProps {
  form: UseFormReturn<any>;
  useGoogleMaps: boolean;
}

export function LocationStep({ form, useGoogleMaps }: LocationStepProps) {
  const handleLocationSelect = (locationData: LocationData) => {
    form.setValue("city", locationData.city, { shouldValidate: true });
    form.setValue("state", locationData.state || '', { shouldValidate: true });
    form.setValue("country", locationData.country, { shouldValidate: true });
    form.setValue("street_name", locationData.streetName, { shouldValidate: true });
    form.setValue("location", locationData.location, { shouldValidate: true });
    form.setValue("longitude", locationData.longitude || null, { shouldValidate: true });
    form.setValue("latitude", locationData.latitude || null, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <LocationPicker
        onLocationSelect={handleLocationSelect}
        initialLocation={{
          longitude: form.getValues("longitude"),
          latitude: form.getValues("latitude"),
        }}
      />
      <FormField
        control={form.control}
        name="street_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>City</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="state"
        render={({ field }) => (
          <FormItem>
            <FormLabel>State</FormLabel>
            <FormControl>
              <Input {...field} />
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
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}