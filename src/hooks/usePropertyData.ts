import { Property, propertyService } from "@/api/properties";
import { useState, useEffect } from "react";

export function usePropertyData(id?: string) {
  const [loading, setLoading] = useState(true);
  const [propertyData, setPropertyData] = useState<Property | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPropertyData() {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await propertyService.getPropertyById(id);
        if (data) {
          setPropertyData(data);
        } else {
          throw new Error("Property not found");
        }
      } catch (err) {
        console.error("Error fetching property data:", err);
        setError(err instanceof Error ? err : new Error("An unknown error occurred"));
        setPropertyData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchPropertyData();
  }, [id]);

  return { loading, propertyData, error };
}