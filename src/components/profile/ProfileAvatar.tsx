
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileAvatarProps {
  userAvatar?: string;
  userName: string;
  userInitials: string;
}

export function ProfileAvatar({ userAvatar, userName, userInitials }: ProfileAvatarProps) {
  return (
    <Avatar className="h-24 w-24 mb-4">
      <AvatarImage src={userAvatar} alt={userName} />
      <AvatarFallback className="text-xl">{userInitials}</AvatarFallback>
    </Avatar>
  );
}
