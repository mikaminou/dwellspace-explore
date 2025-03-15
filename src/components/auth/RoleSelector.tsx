
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RoleSelectorProps {
  userRole: string;
  setUserRole: (value: string) => void;
  disabled?: boolean;
}

export function RoleSelector({ userRole, setUserRole, disabled = false }: RoleSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="role">I am a</Label>
      <Select value={userRole} onValueChange={setUserRole} disabled={disabled}>
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
  );
}
