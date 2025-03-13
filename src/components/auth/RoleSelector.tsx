
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/language/LanguageContext";

interface RoleSelectorProps {
  userRole: string;
  setUserRole: (value: string) => void;
  disabled?: boolean;
}

export function RoleSelector({ userRole, setUserRole, disabled = false }: RoleSelectorProps) {
  const { t, dir } = useLanguage();
  
  return (
    <div className="space-y-2">
      <Label htmlFor="role" className={dir === 'rtl' ? 'arabic-text' : ''}>{t('role.label')}</Label>
      <Select value={userRole} onValueChange={setUserRole} disabled={disabled}>
        <SelectTrigger className={dir === 'rtl' ? 'arabic-text' : ''}>
          <SelectValue placeholder={t('role.placeholder') || "Select your role"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="buyer" className={dir === 'rtl' ? 'arabic-text' : ''}>{t('role.buyer')}</SelectItem>
          <SelectItem value="seller" className={dir === 'rtl' ? 'arabic-text' : ''}>{t('role.seller')}</SelectItem>
          <SelectItem value="agent" className={dir === 'rtl' ? 'arabic-text' : ''}>{t('role.agent')}</SelectItem>
        </SelectContent>
      </Select>
      <p className={`text-xs text-muted-foreground ${dir === 'rtl' ? 'arabic-text' : ''}`}>{t('role.subtitle')}</p>
    </div>
  );
}
