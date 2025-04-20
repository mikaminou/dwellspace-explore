import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { ImageUploadDropzone } from "@/components/owners/ImageUploadDropzone";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function MediaStep({ form, imageUrl, setImageUrl, additionalImageUrls, setAdditionalImageUrls }) {
  const handleMainImageChange = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        form.setValue("image", file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesChange = (files: File[]) => {
    const newImages = files.map((file) => URL.createObjectURL(file));
    setAdditionalImageUrls((prev) => [...prev, ...newImages]);
    form.setValue("additionalImages", [...form.getValues("additionalImages"), ...files]);
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImageUrls((prev) => prev.filter((_, i) => i !== index));
    const currentAdditionalImages = form.getValues("additionalImages");
    form.setValue("additionalImages", currentAdditionalImages.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg">
      <FormField
        control={form.control}
        name="image"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Main Image</FormLabel>
            <FormControl>
              <ImageUploadDropzone
                onChange={handleMainImageChange}
                value={field.value ? [field.value] : []}
                maxFiles={1}
                imageUrls={imageUrl ? [imageUrl] : []}
                onRemoveExisting={() => {
                  setImageUrl("");
                  field.onChange(null);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="additionalImages"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Images</FormLabel>
            <FormControl>
              <ImageUploadDropzone
                onChange={handleAdditionalImagesChange}
                value={field.value || []}
                maxFiles={5}
                imageUrls={additionalImageUrls}
                onRemoveExisting={removeAdditionalImage}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {additionalImageUrls.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Additional Images</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {additionalImageUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img src={url} alt={`Additional ${index + 1}`} className="w-full h-32 object-cover rounded-md transition-transform duration-200 transform group-hover:scale-105" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={() => removeAdditionalImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}