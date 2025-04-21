import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Bed, Bath, Ruler, Home, CheckSquare, Car, X } from "lucide-react";

export function FeaturesStep({ form }) {
  const amenities = [
    "Air Conditioning", "Heating", "Balcony", "Pool", "Garden", "Gym",
    "Elevator", "Parking", "Security System", "Internet", "Cable TV",
    "Washing Machine", "Dishwasher", "Microwave", "Refrigerator"
  ];

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg">
      <div className="flex flex-col md:flex-row md:space-x-4">
        <FormField
          control={form.control}
          name="beds"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>
                <Bed className="inline-block mr-2" />
                Bedrooms
              </FormLabel>
              <FormControl>
              <Input
                  type="number"
                  {...field}
                  placeholder="Enter number of bedrooms"
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
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
            <FormItem className="flex-1">
              <FormLabel>
                <Bath className="inline-block mr-2" />
                Bathrooms
              </FormLabel>
              <FormControl>
              <Input
                  type="number"
                  {...field}
                  placeholder="Enter number of bathrooms"
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                />
                </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex flex-col md:flex-row md:space-x-4">
        <FormField
          control={form.control}
          name="living_area"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>
                <Home className="inline-block mr-2" />
                Living Area (m²)
              </FormLabel>
              <FormControl>
              <Input
                  type="number"
                  {...field}
                  placeholder="Enter living area in m²"
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                />
                </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="plot_area"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>
              <Ruler className="inline-block mr-2" />
                Plot Area (m²)
              </FormLabel>
              <FormControl>
              <Input
                  type="number"
                  {...field}
                  placeholder="Enter plot area in m²"
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                />
                </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex flex-col md:flex-row md:space-x-4">
        <FormField
          control={form.control}
          name="furnished"
          render={({ field }) => (
            <FormItem className="flex-1 flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  <CheckSquare className="inline-block mr-2" />
                  Furnished
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="parking"
          render={({ field }) => (
            <FormItem className="flex-1 flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  <Car className="inline-block mr-2" />
                  Parking
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
      </div>
      <div>
        <FormLabel>Amenities</FormLabel>
        <div className="flex flex-wrap gap-2 mt-2">
          {amenities.map((amenity) => (
            <FormField
              key={amenity}
              control={form.control}
              name="amenities"
              render={({ field }) => {
                const isSelected = field.value?.includes(amenity);
                return (
                  <div
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200 ${
                      isSelected ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'
                    }`}
                    onClick={() => {
                      const newValue = isSelected
                        ? field.value.filter((value) => value !== amenity)
                        : [...(field.value || []), amenity];
                      field.onChange(newValue);
                    }}
                  >
                    <span>{amenity}</span>
                    {isSelected && (
                      <X
                        size={16}
                        className="hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          field.onChange(field.value.filter((value) => value !== amenity));
                        }}
                      />
                    )}
                  </div>
                );
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}