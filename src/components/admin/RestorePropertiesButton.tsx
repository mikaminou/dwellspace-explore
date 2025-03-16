
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { restorePropertiesFromBackup } from "@/api/geocoding";

export function RestorePropertiesButton() {
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoredCount, setRestoredCount] = useState<number | null>(null);
  
  const handleRestore = async () => {
    if (isRestoring) return;
    
    try {
      setIsRestoring(true);
      setRestoredCount(null);
      toast.info("Restoring properties from backup...");
      
      const result = await restorePropertiesFromBackup();
      
      if (result.total > 0) {
        setRestoredCount(result.success);
        toast.success(`Restored ${result.success} properties successfully (${result.errors} errors out of ${result.total} total)`);
      } else {
        toast.error("No properties found in backup");
      }
    } catch (error) {
      console.error("Error restoring properties:", error);
      toast.error("Failed to restore properties");
    } finally {
      setIsRestoring(false);
    }
  };
  
  return (
    <div className="flex flex-col gap-2">
      <Button 
        onClick={handleRestore} 
        disabled={isRestoring}
        variant="outline"
        className="gap-2"
      >
        {isRestoring ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {isRestoring ? "Restoring..." : "Restore Properties"}
      </Button>
      
      {restoredCount !== null && (
        <p className="text-sm text-muted-foreground">
          Successfully restored {restoredCount} properties with coordinates.
        </p>
      )}
    </div>
  );
}
