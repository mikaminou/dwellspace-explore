
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface ProfileCompletionFormProps {
  onComplete: (profileData: {
    first_name: string;
    last_name: string;
    phone_number?: string;
  }) => Promise<void>;
}

export function ProfileCompletionForm({ onComplete }: ProfileCompletionFormProps) {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role] = useState("individual");
  
  // Pre-fill form with data from user metadata if available
  useEffect(() => {
    if (session?.user) {
      const { user_metadata } = session.user;
      
      if (user_metadata) {
        setFirstName(user_metadata.first_name || "");
        setLastName(user_metadata.last_name || "");
      }
    }
  }, [session]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Prepare profile data
      const profileData = {
        first_name: firstName,
        last_name: lastName,
        role,
        phone_number: phoneNumber,
      };
      
      // Call the onComplete callback
      await onComplete(profileData);
      
    } catch (error) {
      console.error("Error submitting profile data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first-name">
            First Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="first-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder="Your first name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="last-name">Last Name</Label>
          <Input
            id="last-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Your last name"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone-number">Phone Number</Label>
        <Input
          id="phone-number"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+1 123 456 7890"
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Complete Profile"
        )}
      </Button>
    </form>
  );
}
