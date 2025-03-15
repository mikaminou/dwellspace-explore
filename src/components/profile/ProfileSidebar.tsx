
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ProfileAvatar } from "./ProfileAvatar";
import { useLanguage } from "@/contexts/language/LanguageContext";

interface ProfileSidebarProps {
  userAvatar?: string;
  userName: string;
  userEmail?: string;
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
    <Card>
      <CardHeader>
        <CardTitle className={dir === 'rtl' ? 'text-right arabic-text' : ''}>
          {t('profile.title') || "Profile"}
        </CardTitle>
        <CardDescription className={dir === 'rtl' ? 'text-right arabic-text' : ''}>
          {t('profile.subtitle') || "Your personal information"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <ProfileAvatar 
          userAvatar={userAvatar}
          userName={userName}
          userInitials={userInitials}
        />
        <h3 className="text-lg font-medium">
          {userName}
        </h3>
        {userEmail && <p className="text-sm text-muted-foreground">{userEmail}</p>}
        {userRole && <p className="text-sm mt-2 capitalize">{userRole}</p>}
      </CardContent>
    </Card>
  );
}
