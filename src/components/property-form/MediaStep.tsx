import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { ImageUploadDropzone } from "@/components/owners/ImageUploadDropzone";

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
    const currentAdditionalImages = form.getValues("additionalImages") || [];
    form.setValue("additionalImages", [...currentAdditionalImages, ...files]);
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
                onChange={(files) => {
                  handleMainImageChange(files);
                  field.onChange(files[0]);
                }}
                onChangeUrls={(urls) => setImageUrl(urls[0] || "")}
                value={field.value ? [field.value] : []}
                imageUrls={imageUrl ? [imageUrl] : []}
                maxFiles={1}
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
                onChange={(files) => {
                  handleAdditionalImagesChange(files);
                  field.onChange([...(field.value || []), ...files]);
                }}
                onChangeUrls={setAdditionalImageUrls}
                value={field.value || []}
                imageUrls={additionalImageUrls}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}