
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { 
  getMaxPropertyPrice, 
  getMaxLivingArea, 
  getAllCities, 
  getCityWithLowestPropertyCount 
} from "@/integrations/supabase/client";

export function useSearchInitialData(
  setMaxPriceLimit: (price: number) => void,
  setMaxPrice: (price: number) => void,
  setMaxLivingAreaLimit: (area: number) => void,
  setMaxLivingArea: (area: number) => void,
  setCities: (cities: string[]) => void,
  setSelectedCities: (cities: string[]) => void,
  setInitialLoadDone: (done: boolean) => void,
  isNewSearch: boolean // Add this parameter
) {
  const { t } = useLanguage();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // 1. Fetch limits
        const maxPrice = await getMaxPropertyPrice();
        setMaxPriceLimit(maxPrice);
        
        // Only set maxPrice if not already set
        const storedMaxPrice = localStorage.getItem('maxPrice');
        if (!storedMaxPrice || storedMaxPrice === "50000000") {
          setMaxPrice(maxPrice);
        }

        const maxLiving = await getMaxLivingArea();
        setMaxLivingAreaLimit(maxLiving);
        
        // Only set maxLivingArea if not already set
        const storedMaxLivingArea = localStorage.getItem('maxLivingArea');
        if (!storedMaxLivingArea || storedMaxLivingArea === "500") {
          setMaxLivingArea(maxLiving);
        }

        // 2. Fetch all cities
        const citiesList = await getAllCities();
        // Remove 'any' option from the city list
        setCities(citiesList);
        
        // 3. Only set default city if this is a new search and no city is selected
        const storedCities = localStorage.getItem('selectedCities');
        const parsedCities = storedCities ? JSON.parse(storedCities) : [];
        
        if (isNewSearch && parsedCities.length === 0) {
          // Get the city with the lowest property count
          const defaultCity = await getCityWithLowestPropertyCount();
          // 4. Set the default city
          setSelectedCities([defaultCity]);
        }
        
        // 5. Set initial load done flag
        setInitialLoadDone(true);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error(t('search.errorFetchingLimits'));
        setInitialLoadDone(true);
      }
    };

    fetchInitialData();
  }, [t, setMaxPriceLimit, setMaxPrice, setMaxLivingAreaLimit, setMaxLivingArea, setCities, setSelectedCities, setInitialLoadDone, isNewSearch]);
}
