
import React, { useEffect, useRef, useState } from "react";
import { MainNav } from "@/components/MainNav";
import { SearchProvider } from "@/contexts/search/SearchContext";
import { Filters } from "@/components/search/Filters";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useNavigate } from "react-router-dom";
import { getAllProperties, Property } from "@/api/properties";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/PropertyCard";
import { XCircle } from "lucide-react";

// Set your Mapbox token here
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoibG92YWJsZS1haSIsImEiOiJjbHhmOHlvemswMGRrMnFxaXU5ZGJ6ZXB2In0.hJxEAyOmE0ycj40XkQSxKA';

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const navigate = useNavigate();
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Load properties and initialize map
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllProperties();
        setProperties(data);
        
        if (data.length > 0) {
          initializeMap(data);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      // Clean up map and markers when component unmounts
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  const initializeMap = (properties: Property[]) => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: calculateCenterCoordinates(properties),
      zoom: 12,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      "top-right"
    );

    // Add properties markers when map is loaded
    map.current.on("load", () => {
      addPropertyMarkers(properties);
    });
  };

  const calculateCenterCoordinates = (properties: Property[]) => {
    // Find properties with coordinates
    const propertiesWithCoordinates = properties.filter(
      (property) => property.longitude && property.latitude
    );

    if (propertiesWithCoordinates.length === 0) {
      // Default to a fallback location if no properties have coordinates
      return [-74.006, 40.7128]; // New York City coordinates
    }

    // Calculate the average of all coordinates
    const total = propertiesWithCoordinates.reduce(
      (acc, property) => {
        acc.longitude += property.longitude || 0;
        acc.latitude += property.latitude || 0;
        return acc;
      },
      { longitude: 0, latitude: 0 }
    );

    return [
      total.longitude / propertiesWithCoordinates.length,
      total.latitude / propertiesWithCoordinates.length,
    ];
  };

  const addPropertyMarkers = (properties: Property[]) => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add markers for each property with coordinates
    properties.forEach((property) => {
      if (!property.longitude || !property.latitude) return;

      // Create custom marker element
      const markerElement = document.createElement("div");
      markerElement.className = 'property-marker';
      markerElement.innerHTML = `
        <div class="marker-price">
          ${property.price}
        </div>
      `;
      markerElement.style.cssText = `
        cursor: pointer;
        width: auto;
        min-width: 80px;
        text-align: center;
        padding: 4px 8px;
        border-radius: 4px;
        background-color: #10b981;
        color: white;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        transition: all 0.2s ease;
      `;

      // Create marker
      const marker = new mapboxgl.Marker({
        element: markerElement,
        anchor: "bottom",
      })
        .setLngLat([property.longitude, property.latitude])
        .addTo(map.current);

      // Add click event to marker
      markerElement.addEventListener("click", () => {
        setSelectedProperty(property);
        
        // Fly to property
        map.current?.flyTo({
          center: [property.longitude || 0, property.latitude || 0],
          zoom: 15,
          essential: true,
        });
      });

      // Add hover effects
      markerElement.addEventListener("mouseenter", () => {
        markerElement.style.transform = "scale(1.1)";
        markerElement.style.backgroundColor = "#059669";
      });

      markerElement.addEventListener("mouseleave", () => {
        markerElement.style.transform = "scale(1)";
        markerElement.style.backgroundColor = "#10b981";
      });

      // Save marker reference for cleanup
      markersRef.current.push(marker);
    });
  };

  return (
    <SearchProvider>
      <div className="min-h-screen bg-background">
        <MainNav />
        <div className="flex flex-col h-[calc(100vh-4rem)]">
          <Filters />
          <div className="flex-1 relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                <div className="text-lg">Loading map...</div>
              </div>
            ) : (
              <div ref={mapContainer} className="absolute inset-0" />
            )}
            
            {/* Property popup when a marker is clicked */}
            {selectedProperty && (
              <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-xl p-4 max-w-md z-10">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold line-clamp-1">
                    {selectedProperty.title}
                  </h3>
                  <button
                    onClick={() => setSelectedProperty(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XCircle size={20} />
                  </button>
                </div>
                
                <div className="mb-2 text-sm text-gray-600">
                  {selectedProperty.location || selectedProperty.city}
                </div>
                
                <div>
                  <PropertyCard property={selectedProperty} compact={true} />
                  <Button 
                    className="w-full mt-4" 
                    onClick={() => navigate(`/property/${selectedProperty.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SearchProvider>
  );
}
