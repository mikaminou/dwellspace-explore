
import React from 'react';
import { Check, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchResult {
  description: string;
  place_id: string;
}

interface LocationSearchResultsProps {
  results: SearchResult[];
  show: boolean;
  onSelectLocation: (result: SearchResult) => void;
}

export function LocationSearchResults({ 
  results, 
  show, 
  onSelectLocation 
}: LocationSearchResultsProps) {
  if (!show || results.length === 0) return null;
  
  return (
    <div className="absolute z-10 mt-1 w-full bg-white rounded-xl shadow-lg max-h-60 overflow-auto border border-gray-100">
      <ul className="py-1 divide-y divide-gray-50">
        {results.map((result, index) => (
          <li
            key={index}
            className="group"
            onClick={() => onSelectLocation(result)}
          >
            <div className={cn(
              "flex items-center gap-2 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors",
              "text-sm text-gray-700"
            )}>
              <div className="flex-shrink-0">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-grow truncate">
                {result.description}
              </div>
              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <Check className="h-4 w-4 text-primary" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
