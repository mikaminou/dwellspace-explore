
import React from 'react';
import { Button } from "@/components/ui/button";

export function RestorePropertiesButton() {
  return (
    <div className="flex flex-col gap-2">
      <Button 
        variant="outline"
        className="gap-2"
        disabled={true}
      >
        Property Restoration Removed
      </Button>
      
      <p className="text-sm text-muted-foreground">
        The property restoration functionality has been removed.
      </p>
    </div>
  );
}
