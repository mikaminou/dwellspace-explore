
import React, { useCallback, useState } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadDropzoneProps {
  onChange: (files: File[]) => void;
  value: File[];
  maxFiles?: number;
  imageUrls?: string[];
  onRemoveExisting?: (index: number) => void;
  className?: string;
}

export function ImageUploadDropzone({
  onChange,
  value = [],
  maxFiles = 10,
  imageUrls = [],
  onRemoveExisting,
  className,
}: ImageUploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (!files || files.length === 0) return;

      // Filter for image files
      const imageFiles = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );

      if (imageFiles.length === 0) return;

      // Check if adding these files would exceed the max
      if (value.length + imageFiles.length > maxFiles) {
        alert(`You can only upload up to ${maxFiles} images`);
        return;
      }

      onChange([...value, ...imageFiles]);
    },
    [maxFiles, onChange, value]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      // Check if adding these files would exceed the max
      if (value.length + files.length > maxFiles) {
        alert(`You can only upload up to ${maxFiles} images`);
        return;
      }

      onChange([...value, ...Array.from(files)]);
      
      // Reset the input so the same file can be uploaded again if removed
      e.target.value = "";
    },
    [maxFiles, onChange, value]
  );

  const handleRemoveFile = useCallback(
    (index: number) => {
      const newFiles = [...value];
      newFiles.splice(index, 1);
      onChange(newFiles);
    },
    [onChange, value]
  );

  const totalImages = value.length + imageUrls.length;
  const showDropzone = totalImages < maxFiles;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Preview grid */}
      {(value.length > 0 || imageUrls.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Render existing image URLs */}
          {imageUrls.map((url, index) => (
            <div key={`url-${index}`} className="relative aspect-square rounded-md overflow-hidden group">
              <img
                src={url}
                alt={`Uploaded ${index}`}
                className="w-full h-full object-cover"
              />
              {onRemoveExisting && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRemoveExisting(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}

          {/* Render new file previews */}
          {value.map((file, index) => (
            <div key={`file-${index}`} className="relative aspect-square rounded-md overflow-hidden group">
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${index}`}
                className="w-full h-full object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveFile(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Dropzone */}
      {showDropzone && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-gray-300 hover:border-gray-400"
          )}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="p-3 bg-primary/10 rounded-full">
              {isDragging ? (
                <ImageIcon className="h-8 w-8 text-primary" />
              ) : (
                <Upload className="h-8 w-8 text-primary" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">
                {isDragging ? "Drop files here" : "Drag & drop files here"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                or click to browse files
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {`Max ${maxFiles} images. Supported formats: JPEG, PNG, WebP`}
            </p>
            <input
              type="file"
              onChange={handleFileInputChange}
              accept="image/*"
              multiple
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={(e) => e.stopPropagation()}
              >
                Choose Files
              </Button>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
