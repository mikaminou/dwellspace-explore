
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/language/LanguageContext";

interface RoleSelectorProps {
  userRole: string;
  setUserRole: (value: string) => void;
  disabled?: boolean;
}

export function RoleSelector({ userRole, setUserRole, disabled = false }: RoleSelectorProps) {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-2">
      <Label htmlFor="role">{t('role.label')}</Label>
      <Select value={userRole} onValueChange={setUserRole} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder="Select your role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="buyer">{t('role.buyer')}</SelectItem>
          <SelectItem value="seller">{t('role.seller')}</SelectItem>
          <SelectItem value="agent">{t('role.agent')}</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">{t('role.subtitle')}</p>
    </div>
  );
}
