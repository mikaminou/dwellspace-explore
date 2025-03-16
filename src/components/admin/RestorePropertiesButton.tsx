
import React from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getPropertiesWithGeodata } from "@/api/geocoding";

export function RestorePropertiesButton() {
  const handleRestore = async () => {
    try {
      toast.loading("Loading properties with geodata...");
      const properties = await getPropertiesWithGeodata();
      toast.success(`Loaded ${properties.length} properties with geodata`);
    } catch (error) {
      console.error("Error restoring properties:", error);
      toast.error("Failed to restore properties with geodata");
    }
  };

  return (
    <Button onClick={handleRestore} variant="outline" size="sm">
      Load Properties with Geodata
    </Button>
  );
}
