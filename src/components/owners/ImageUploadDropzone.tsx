import React, { useCallback, useRef, useState, useEffect } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadDropzoneProps {
  onChange: (files: File[]) => void;
  onChangeUrls: (urls: string[]) => void;
  value: File[];
  maxFiles?: number;
  imageUrls: string[];
  className?: string;
}

export function ImageUploadDropzone({
  onChange,
  onChangeUrls,
  value = [],
  maxFiles = 20,
  imageUrls = [],
  className,
}: ImageUploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const addNewImages = useCallback((newFiles: File[]) => {
    const newImageUrls = newFiles.map(file => URL.createObjectURL(file));
    onChangeUrls([...imageUrls, ...newImageUrls]);
    onChange([...value, ...newFiles]);
  }, [imageUrls, onChangeUrls, onChange, value]);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (!files || files.length === 0) return;

      const imageFiles = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );

      if (imageFiles.length === 0) return;

      if (imageUrls.length + imageFiles.length > maxFiles) {
        alert(`You can only upload up to ${maxFiles} images`);
        return;
      }

      addNewImages(imageFiles);
    },
    [maxFiles, addNewImages, imageUrls.length]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      if (imageUrls.length + files.length > maxFiles) {
        alert(`You can only upload up to ${maxFiles} images`);
        return;
      }

      addNewImages(Array.from(files));
      e.target.value = "";
    },
    [maxFiles, addNewImages, imageUrls.length]
  );

  const handleChooseFiles = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemoveImage = useCallback(
    (index: number) => {
      const newImageUrls = [...imageUrls];
      newImageUrls.splice(index, 1);
      onChangeUrls(newImageUrls);

      if (index < value.length) {
        const newFiles = [...value];
        newFiles.splice(index, 1);
        onChange(newFiles);
      }
    },
    [imageUrls, onChangeUrls, onChange, value]
  );

  const showDropzone = imageUrls.length < maxFiles;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Image grid */}
      {imageUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {imageUrls.map((url, index) => (
            <div key={url} className="relative aspect-square rounded-md overflow-hidden group">
              <img
                src={url}
                alt={`Image ${index}`}
                className="w-full h-full object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveImage(index)}
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
              ref={fileInputRef}
              type="file"
              onChange={handleFileInputChange}
              accept="image/*"
              multiple
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={handleChooseFiles}
            >
              Choose Files
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}