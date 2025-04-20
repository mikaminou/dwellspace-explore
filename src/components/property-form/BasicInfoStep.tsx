import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign, Home, Tag, Type } from "lucide-react";

export function BasicInfoStep({ form }) {
  return (
    <div className="space-y-6 p-6 bg-white rounded-lg">
      <div className="flex flex-col md:flex-row md:space-x-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>
                <Tag className="inline-block mr-2" />
                Title
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter property title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="listing_type"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>
                <Tag className="inline-block mr-2" />
                Listing Type
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue="rent">
                <SelectTrigger>
                  <SelectValue placeholder="Select listing type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">For Sale</SelectItem>
                  <SelectItem value="rent">For Rent</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>
                <Home className="inline-block mr-2" />
                Property Type
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue="apartment">
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex flex-col md:flex-row md:space-x-4">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>
                <DollarSign className="inline-block mr-2" />
                Price
              </FormLabel>
              <FormControl>
                <Input type="number" {...field} placeholder="Enter price" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>
                <DollarSign className="inline-block mr-2" />
                Currency
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue="DZD">
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
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
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              <Type className="inline-block mr-2" />
              Description
            </FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Enter property description" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}