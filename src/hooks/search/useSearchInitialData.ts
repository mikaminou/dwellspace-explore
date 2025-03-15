
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
  setSelectedCity: (city: string) => void,
  setInitialLoadDone: (done: boolean) => void
) {
  const { t } = useLanguage();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // 1. Fetch limits
        const maxPrice = await getMaxPropertyPrice();
        setMaxPriceLimit(maxPrice);
        setMaxPrice(maxPrice);

        const maxLiving = await getMaxLivingArea();
        setMaxLivingAreaLimit(maxLiving);
        setMaxLivingArea(maxLiving);

        // 2. Fetch all cities
        const citiesList = await getAllCities();
        setCities(['any', ...citiesList]);
        
        // 3. Get the city with the lowest property count
        const defaultCity = await getCityWithLowestPropertyCount();
        
        // 4. Set the default city
        setSelectedCity(defaultCity);
        
        // 5. Set initial load done flag
        setInitialLoadDone(true);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error(t('search.errorFetchingLimits'));
        setInitialLoadDone(true);
      }
    };

    fetchInitialData();
  }, [t, setMaxPriceLimit, setMaxPrice, setMaxLivingAreaLimit, setMaxLivingArea, setCities, setSelectedCity, setInitialLoadDone]);
}
