
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RoleSelectorProps {
  userRole: string;
  setUserRole: (value: string) => void;
  agency: string;
  setAgency: (value: string) => void;
  licenseNumber?: string;
  setLicenseNumber?: (value: string) => void;
  disabled?: boolean;
}

export function RoleSelector({ 
  userRole, 
  setUserRole, 
  agency, 
  setAgency,
  licenseNumber = "",
  setLicenseNumber,
  disabled = false 
}: RoleSelectorProps) {
  const [showAgencyField, setShowAgencyField] = useState(false);
  const [showLicenseField, setShowLicenseField] = useState(false);
  
  useEffect(() => {
    setShowAgencyField(userRole === 'agent' || userRole === 'seller');
    setShowLicenseField(userRole === 'agent');
  }, [userRole]);

  // Make sure the role is restricted to valid enum values in database
  const handleRoleChange = (value: string) => {
    if (["buyer", "seller", "agent"].includes(value)) {
      setUserRole(value);
    } else {
      console.error("Invalid role selected:", value);
      setUserRole("buyer"); // Default to buyer if invalid
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="role">I am a</Label>
        <Select 
          value={userRole} 
          onValueChange={handleRoleChange}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="buyer">Buyer</SelectItem>
            <SelectItem value="seller">Seller</SelectItem>
            <SelectItem value="agent">Agent</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">Select your role in the platform</p>
      </div>

      {showAgencyField && (
        <div className="space-y-2">
          <Label htmlFor="agency">
            {userRole === 'agent' ? 'Agency Name*' : 'Business Name (Optional)'}
          </Label>
          <Input
            id="agency"
            placeholder={userRole === 'agent' ? "Enter your agency name" : "Enter your business name (optional)"}
            value={agency}
            onChange={(e) => setAgency(e.target.value)}
            disabled={disabled}
            required={userRole === 'agent'}
          />
        </div>
      )}

      {showLicenseField && setLicenseNumber && (
        <div className="space-y-2">
          <Label htmlFor="license">License Number*</Label>
          <Input
            id="license"
            placeholder="Enter your license number"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            disabled={disabled}
            required={true}
          />
        </div>
      )}
    </div>
  );
}
