import * as React from "react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { SearchIcon, MapIcon, HeartIcon, UserIcon, LogOut, HomeIcon, MessageSquare, Plus, LayoutDashboard, Key, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth";
import { NotificationBell } from "./NotificationBell";
import { LanguageToggle } from "./LanguageToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProfile } from "@/hooks/useProfile";

const LOGO_URL = "https://kaebtzbmtozoqvsdojkl.supabase.co/storage/v1/object/sign/herosection/logo.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJoZXJvc2VjdGlvbi9sb2dvLnBuZyIsImlhdCI6MTc0MTk1NDgzOCwiZXhwIjoxNzczNDkwODM4fQ.8WLPyFQhA5EnkDuoHlClDrI2JzmZ5wKbpGE1clp8VrU";

export function MainNav() {
  const { session, currentUser, isLoaded, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const { profileData, isLoaded: isProfileLoaded } = useProfile();
  const userRole = profileData?.role;
  
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const userEmail = session?.user?.email || currentUser?.email;
  const userName = session?.user?.user_metadata?.first_name || currentUser?.displayName;
  const userAvatar = session?.user?.user_metadata?.avatar_url || currentUser?.photoURL;
  const userInitials = userName 
    ? userName.slice(0, 2).toUpperCase() 
    : userEmail 
      ? userEmail.slice(0, 2).toUpperCase() 
      : "U";

  return (
    <div className="border-b glass">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <img 
            src={LOGO_URL} 
            alt="Osken Logo" 
            className="h-8" 
          />
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Button variant="ghost" asChild>
                <Link to="/search" className="flex items-center gap-2">
                  <SearchIcon className="h-4 w-4" />
                  <span>Search</span>
                </Link>
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button variant="ghost" asChild>
                <Link to="/map" className="flex items-center gap-2">
                  <MapIcon className="h-4 w-4" />
                  <span>Map</span>
                </Link>
              </Button>
            </NavigationMenuItem>
            
            {isLoaded && session && (
              <>
                <NavigationMenuItem>
                  <Button variant="ghost" asChild>
                    <Link to="/dashboard" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    <span>My Immo</span>
                    </Link>
                  </Button>
                </NavigationMenuItem>
              </>
            )}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="ml-auto flex items-center space-x-4">
          <LanguageToggle />
          {isLoaded && session ? (
            <>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/favorites">
                  <HeartIcon className="h-5 w-5" />
                  <span className="sr-only">Favorites</span>
                </Link>
              </Button>
              
              <Button variant="ghost" size="icon" asChild>
                <Link to="/messages">
                  <MessageSquare className="h-5 w-5" />
                  <span className="sr-only">Messages</span>
                </Link>
              </Button>
              <NotificationBell />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src={userAvatar || undefined} alt={userName || "User"} />
                      <AvatarFallback>
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuLabel className="font-normal">
                    {userName || userEmail}
                    {userRole && (
                      <div className="text-xs text-muted-foreground capitalize">{userRole}</div>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/favorites">
                      <HeartIcon className="mr-2 h-4 w-4" />
                      <span>Favorites</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>My Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/property-create">
                      <Plus className="mr-2 h-4 w-4" />
                      <span>Add Property</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="default" asChild>
                <Link to="/auth">Log In</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
