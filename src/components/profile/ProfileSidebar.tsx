
import { Card, CardContent } from "@/components/ui/card";
import { ProfileAvatar } from "./ProfileAvatar";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language/LanguageContext";

interface ProfileSidebarProps {
  userAvatar?: string | null;
  userName: string;
  userEmail?: string | null;
  userRole?: string;
  userInitials: string;
}

export function ProfileSidebar({ 
  userAvatar, 
  userName, 
  userEmail, 
  userRole, 
  userInitials 
}: ProfileSidebarProps) {
  const { t, dir } = useLanguage();
  
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6 flex flex-col items-center gap-4">
          <ProfileAvatar avatarUrl={userAvatar} userInitials={userInitials} userName={userName} />
          
          <div className="text-center">
            <h3 className={`text-xl font-semibold ${dir === 'rtl' ? 'arabic-text' : ''}`}>{userName}</h3>
            
            {userRole && (
              <div className="mb-1 mt-2">
                <Badge variant="secondary" className="capitalize">
                  {userRole}
                </Badge>
              </div>
            )}
            {userEmail && (
              <p className="text-sm text-muted-foreground mt-1">{userEmail}</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h4 className={`font-medium mb-2 ${dir === 'rtl' ? 'arabic-text' : ''}`}>{t('profile.accountType') || "Account Type"}</h4>
          
          <div className="flex flex-col gap-1">
            <div className="text-sm">
              <span className="text-muted-foreground">{t('profile.role') || "Role"}:</span> <span className="capitalize">{userRole || "Buyer"}</span>
            </div>
            
            <div className="text-sm">
              <span className="text-muted-foreground">{t('profile.memberSince') || "Member Since"}:</span> <span>March 2025</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
