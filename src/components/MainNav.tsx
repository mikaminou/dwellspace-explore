
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
import { SearchIcon, MapIcon, HeartIcon, UserIcon, LogOut, HomeIcon, MessageSquare, Plus, LayoutDashboard } from "lucide-react";
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

// Logo URL configuration
const LOGO_URL = "https://kaebtzbmtozoqvsdojkl.supabase.co/storage/v1/object/sign/herosection/logo.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJoZXJvc2VjdGlvbi9sb2dvLnBuZyIsImlhdCI6MTc0MTk1NDgzOCwiZXhwIjoxNzczNDkwODM4fQ.8WLPyFQhA5EnkDuoHlClDrI2JzmZ5wKbpGE1clp8VrU";

export function MainNav() {
  const { session, currentUser, isLoaded, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Get user profile data to determine role
  const { profileData, isLoaded: isProfileLoaded } = useProfile();
  const userRole = profileData?.role || "buyer"; // Default to buyer if no role found
  const isSellerOrAgent = ["seller", "agent", "admin"].includes(userRole);
  
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
              <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-[400px] grid-cols-2">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link to="/properties/sale" className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                        <div className="mb-2 mt-4 text-lg font-medium">
                          For Sale
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Find your dream home from our curated selection
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link to="/properties/rent" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">For Rent</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Browse properties available for rent
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link to="/map" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Map</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Explore properties on the map
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            {/* Common navigation items for all users */}
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
            
            {/* Role-specific navigation items */}
            {isLoaded && session && isSellerOrAgent && (
              <>
                <NavigationMenuItem>
                  <Button variant="ghost" asChild>
                    <Link to="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
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
              
              {/* Messages button for all authenticated users */}
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
                  
                  {/* Role-specific dropdown items */}
                  {isSellerOrAgent && (
                    <>
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
                    </>
                  )}
                  
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
              <Button variant="ghost" asChild>
                <Link to="/signin">Sign In</Link>
              </Button>
              <Button variant="default" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
