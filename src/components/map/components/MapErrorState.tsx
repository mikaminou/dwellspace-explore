
import React from 'react';
import { ShieldAlert, Info } from "lucide-react";

interface MapErrorStateProps {
  errorMessage: string | null;
}

export function MapErrorState({ errorMessage }: MapErrorStateProps) {
  if (!errorMessage) return null;

  return (
    <div className="w-full h-[300px] rounded-md border flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <ShieldAlert className="h-10 w-10 text-red-500 mb-2" />
      <p className="text-red-500 font-medium mb-2">
        {errorMessage}
      </p>
      <div className="bg-amber-50 border border-amber-200 rounded p-3 text-amber-800 text-sm mt-2 max-w-md">
        <p className="font-medium flex items-center gap-2">
          <Info className="h-4 w-4" />
          Google Maps API requires:
        </p>
        <ul className="list-disc ml-5 mt-1 text-xs text-left">
          <li>Valid API key with proper restrictions</li>
          <li>Billing enabled in Google Cloud Console</li>
          <li>Maps JavaScript API, Places API, and Geocoding API enabled</li>
        </ul>
      </div>
    </div>
  );
}
