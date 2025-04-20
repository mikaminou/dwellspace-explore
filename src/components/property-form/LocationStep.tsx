import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LocationPicker } from "@/components/map/LocationPicker";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MapPin, Building, Globe, Home } from "lucide-react";

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
    <div className="space-y-6 p-6 bg-white rounded-lg">
        <LocationPicker
          onLocationSelect={handleLocationSelect}
          initialLocation={{
            longitude: form.getValues("longitude"),
            latitude: form.getValues("latitude"),
          }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField
            control={form.control}
            name="street_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Home className="inline-block mr-2" />
                  Street Name
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter street name" />
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
                <FormLabel>
                  <Building className="inline-block mr-2" />
                  City
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter city" />
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
                <FormLabel>
                  <MapPin className="inline-block mr-2" />
                  State
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter state" />
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
                <FormLabel>
                  <Globe className="inline-block mr-2" />
                  Country
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter country" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
  );
}