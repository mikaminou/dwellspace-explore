
import React from 'react';
import { ShieldAlert, Info } from "lucide-react";

interface MapErrorStateProps {
  errorMessage: string | null;
}

export function MapErrorState({ errorMessage }: MapErrorStateProps) {
  if (!errorMessage) return null;

  return (
    <div className="w-full h-[300px] rounded-lg border flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <ShieldAlert className="h-10 w-10 text-red-500 mb-3" />
      <p className="text-red-500 font-medium mb-3 max-w-md">
        {errorMessage}
      </p>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm mt-2 max-w-md">
        <p className="font-medium flex items-center gap-2 mb-2">
          <Info className="h-4 w-4" />
          Google Maps API requires:
        </p>
        <ul className="list-disc ml-5 text-xs text-left space-y-1">
          <li>Valid API key with proper restrictions</li>
          <li>Billing enabled in Google Cloud Console</li>
          <li>Maps JavaScript API, Places API, and Geocoding API enabled</li>
        </ul>
      </div>
    </div>
  );
}
