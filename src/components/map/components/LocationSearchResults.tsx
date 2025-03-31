
import React from 'react';

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
    <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
      <ul className="py-1">
        {results.map((result, index) => (
          <li
            key={index}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            onClick={() => onSelectLocation(result)}
          >
            {result.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
