import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { AmenityItem } from "@/components/owners/AmenityItem";

export function FeaturesStep({ form }) {
  const amenities = [
    "Air Conditioning", "Heating", "Balcony", "Pool", "Garden", "Gym",
    "Elevator", "Parking", "Security System", "Internet", "Cable TV",
    "Washing Machine", "Dishwasher", "Microwave", "Refrigerator"
  ];

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="beds"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bedrooms</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
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
              <Input type="number" {...field} />
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
              <Input type="number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="plot_area"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Plot Area (m²)</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
            <FormMessage />
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
            </div>
          </FormItem>
        )}
      />
      <div>
        <FormLabel>Amenities</FormLabel>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
          {amenities.map((amenity) => (
            <FormField
              key={amenity}
              control={form.control}
              name="amenities"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(amenity)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...field.value, amenity])
                          : field.onChange(field.value?.filter((value) => value !== amenity));
                      }}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    <AmenityItem amenity={amenity} />
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}