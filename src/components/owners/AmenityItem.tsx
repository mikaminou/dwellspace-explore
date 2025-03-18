
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

// Map of amenity names to their icons
const amenityIcons: Record<string, React.ReactNode> = {
  "Air Conditioning": <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4.5"/><path d="M14.5 21H19a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-4.5"/><path d="M3 8h12"/><path d="M21 16H9"/><path d="M3 16h2"/><path d="M21 8h-2"/><path d="M12 3v18"/></svg>,
  "Heating": <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.5 10c0-1-3-2.5-3-2.5s-3 1.5-3 2.5c0 .5.3 1 1 1h4c.7 0 1-.5 1-1Z"/><path d="M12 10.5v3c0 1.3-3.1 1.3-3.1 0V7c0-2-3-2-3 0v3c0 1.3-3.1 1.3-3.1 0V5.8"/><path d="M14 14c1.3 0 2 1.3 2 2a4 4 0 0 1-4 4c-1.8 0-3-1-3.5-2"/></svg>,
  "Balcony": <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20"/><path d="M5 12v8"/><path d="M19 12v8"/><path d="M5 8h14v4H5z"/><circle cx="5" cy="4" r="2"/><circle cx="19" cy="4" r="2"/></svg>,
  "Pool": <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20"/><path d="M2 12a10 10 0 0 1 20 0"/><path d="M2 12a10 10 0 0 0 20 0"/><path d="M12 2v20"/></svg>,
  "Garden": <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19.8C22 18.78 19 15 19 15s-3 3.78-3 4.8a3 3 0 1 0 6 0Z"/><path d="M2 14.5C2 13.48 5 9.7 5 9.7s3 3.78 3 4.8a3 3 0 0 1-6 0Z"/><path d="M13 3s1 1 1 4-1 4-1 4"/><path d="M8 13s0-7 5-9c0 0 3 3.5 3 9v2"/><path d="M18 15.5c0-1.25.5-2.5 2-2.5v-1c0-1.5.5-3 2-3"/><path d="M0 12c0-3 0-6 12-6q0 2 12 6"/></svg>,
  "Gym": <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.7 6.7c-.3-.3-.7-.4-1.1-.4H3.4c-.4 0-.8.1-1.1.4-.3.3-.4.7-.4 1.1v12.8c0 .4.1.8.4 1.1.3.3.7.4 1.1.4h2.2c.4 0 .8-.1 1.1-.4.3-.3.4-.7.4-1.1V7.9c0-.4-.1-.8-.4-1.2Z"/><path d="M22.1 7.8c0-.4-.1-.8-.4-1.1-.3-.3-.7-.4-1.1-.4h-2.2c-.4 0-.8.1-1.1.4-.3.3-.4.7-.4 1.1v12.8c0 .4.1.8.4 1.1.3.3.7.4 1.1.4h2.2c.4 0 .8-.1 1.1-.4.3-.3.4-.7.4-1.1V7.8Z"/><path d="M19 7v10"/><path d="M5 7v10"/><path d="m8 7 3 10"/><path d="m16 7-3 10"/></svg>,
  "Elevator": <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m8 8 4-4 4 4"/><path d="M12 4v16"/></svg>,
  "Parking": <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>,
  "Security System": <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="9" r="6"/><path d="M12 15v6"/><path d="M8 17h8"/></svg>,
  "Internet": <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  "Cable TV": <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>,
  "Washing Machine": <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><path d="M3 7h18" /><path d="M4 11h16" /><path d="M8 16a2 2 0 0 1 3-1.5c1 .7 1.5-.5 3-1.5" /></svg>,
  "Dishwasher": <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10h18M3 14h18" /><path d="M5 18h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2Z" /><path d="M12 2v4" /></svg>,
  "Microwave": <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="12" x="4" y="6" rx="2" /><path d="M4 14h16" /><path d="M19 14v4" /></svg>,
  "Refrigerator": <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6Z"/><path d="M5 10h14"/><path d="M9 2v4"/><path d="M9 16v4"/></svg>,
};

interface AmenityItemProps {
  name: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function AmenityItem({ name, checked, onCheckedChange }: AmenityItemProps) {
  const icon = amenityIcons[name] || <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/></svg>;

  return (
    <div 
      className={cn(
        "relative flex flex-col items-center justify-center border rounded-md p-4 cursor-pointer transition-all",
        checked 
          ? "border-primary bg-primary/5 text-primary" 
          : "border-gray-200 hover:border-gray-300 text-gray-600"
      )}
      onClick={() => onCheckedChange(!checked)}
    >
      <div className="absolute top-2 right-2">
        {checked && <Check className="h-4 w-4 text-primary" />}
      </div>
      <div className="mb-2">
        {icon}
      </div>
      <span className="text-xs text-center">{name}</span>
      <Checkbox
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="sr-only"
      />
    </div>
  );
}
