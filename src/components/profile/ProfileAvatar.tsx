
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileAvatarProps {
  avatarUrl?: string | null;
  userInitials: string;
  userName?: string;
}

export function ProfileAvatar({ avatarUrl, userInitials, userName }: ProfileAvatarProps) {
  return (
    <Avatar className="h-24 w-24 mb-4">
      <AvatarImage src={avatarUrl} alt={userName || userInitials} />
      <AvatarFallback className="text-xl">{userInitials}</AvatarFallback>
    </Avatar>
  );
}
