
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";

interface ProfileCompletionFormProps {
  onComplete: (profileData: {
    first_name: string;
    last_name: string;
    role: string;
    agency?: string;
    license_number?: string;
    phone_number?: string;
    bio?: string;
  }) => Promise<void>;
}

export function ProfileCompletionForm({ onComplete }: ProfileCompletionFormProps) {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("buyer");
  const [agency, setAgency] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [bio, setBio] = useState("");
  
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
        bio,
        ...(role === "agent" || role === "seller" ? { 
          agency,
          ...(role === "agent" ? { license_number: licenseNumber } : {})
        } : {})
      };
      
      // Call the onComplete callback
      await onComplete(profileData);
      
    } catch (error) {
      console.error("Error submitting profile data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Determine if we should show agency/license number fields
  const isOwner = role === "agent" || role === "seller";
  
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
      
      <div className="space-y-3">
        <Label>
          I am a <span className="text-red-500">*</span>
        </Label>
        <RadioGroup value={role} onValueChange={setRole} className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="buyer" id="buyer" />
            <Label htmlFor="buyer">Buyer</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="seller" id="seller" />
            <Label htmlFor="seller">Seller</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="agent" id="agent" />
            <Label htmlFor="agent">Agent</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="admin" id="admin" />
            <Label htmlFor="admin">Admin</Label>
          </div>
        </RadioGroup>
      </div>
      
      {isOwner && (
        <div className="space-y-2">
          <Label htmlFor="agency">
            {role === "agent" ? "Agency Name" : "Business Name"}
          </Label>
          <Input
            id="agency"
            value={agency}
            onChange={(e) => setAgency(e.target.value)}
            placeholder={role === "agent" ? "Agency name" : "Business name"}
          />
        </div>
      )}
      
      {role === "agent" && (
        <div className="space-y-2">
          <Label htmlFor="license-number">License Number</Label>
          <Input
            id="license-number"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            placeholder="Your license number"
          />
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="bio">About Me</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us a little about yourself"
          rows={3}
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
