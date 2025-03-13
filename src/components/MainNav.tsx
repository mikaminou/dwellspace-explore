
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
import { SearchIcon, MapIcon, HeartIcon, UserIcon, LogOut } from "lucide-react";
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
import { useLanguage } from "@/contexts/language/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

export function MainNav() {
  const { session, currentUser, isLoaded, signOut } = useAuth();
  const { t, dir } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
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
      <div className={`flex h-16 items-center px-4 container mx-auto ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
        <Link to="/" className={`${dir === 'rtl' ? 'ml-6' : 'mr-6'} flex items-center space-x-2`}>
          <span className={`text-xl font-bold ${dir === 'rtl' ? 'arabic-text' : ''}`}>{t('site.name')}</span>
        </Link>
        <NavigationMenu dir={dir}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className={dir === 'rtl' ? 'arabic-text' : ''}>{t('nav.explore')}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-[400px] grid-cols-2">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link to="/properties/sale" className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                        <div className={`mb-2 mt-4 text-lg font-medium ${dir === 'rtl' ? 'arabic-text' : ''}`}>
                          {t('nav.sale')}
                        </div>
                        <p className={`text-sm leading-tight text-muted-foreground ${dir === 'rtl' ? 'arabic-text' : ''}`}>
                          {dir === 'rtl' 
                            ? 'اعثر على منزل أحلامك من مجموعتنا المختارة'
                            : 'Trouvez votre maison de rêve parmi notre sélection'}
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link to="/properties/rent" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className={`text-sm font-medium leading-none ${dir === 'rtl' ? 'arabic-text' : ''}`}>{t('nav.rent')}</div>
                        <p className={`line-clamp-2 text-sm leading-snug text-muted-foreground ${dir === 'rtl' ? 'arabic-text' : ''}`}>
                          {dir === 'rtl' 
                            ? 'تصفح العقارات للإيجار'
                            : 'Parcourir les propriétés à louer'}
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link to="/map" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className={`text-sm font-medium leading-none ${dir === 'rtl' ? 'arabic-text' : ''}`}>{t('nav.map')}</div>
                        <p className={`line-clamp-2 text-sm leading-snug text-muted-foreground ${dir === 'rtl' ? 'arabic-text' : ''}`}>
                          {dir === 'rtl' 
                            ? 'استكشاف العقارات على الخريطة'
                            : 'Explorer les propriétés sur la carte'}
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button variant="ghost" asChild>
                <Link to="/search" className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <SearchIcon className="h-4 w-4" />
                  <span className={dir === 'rtl' ? 'arabic-text' : ''}>{t('nav.search')}</span>
                </Link>
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button variant="ghost" asChild>
                <Link to="/map" className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <MapIcon className="h-4 w-4" />
                  <span className={dir === 'rtl' ? 'arabic-text' : ''}>{t('nav.map')}</span>
                </Link>
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className={`${dir === 'rtl' ? 'mr-auto' : 'ml-auto'} flex items-center space-x-4`}>
          <LanguageToggle />
          
          {isLoaded && session ? (
            <>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/favorites">
                  <HeartIcon className="h-5 w-5" />
                  <span className="sr-only">{t('nav.favorites')}</span>
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
                <DropdownMenuContent className="w-56" align={dir === 'rtl' ? 'start' : 'end'} forceMount>
                  <DropdownMenuLabel className={dir === 'rtl' ? 'arabic-text' : ''}>{t('account.myAccount')}</DropdownMenuLabel>
                  <DropdownMenuLabel className={`font-normal ${dir === 'rtl' ? 'arabic-text' : ''}`}>
                    {userName || userEmail}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className={dir === 'rtl' ? 'flex flex-row-reverse' : ''}>
                      <UserIcon className={`${dir === 'rtl' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                      <span className={dir === 'rtl' ? 'arabic-text' : ''}>{t('nav.profile')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/favorites" className={dir === 'rtl' ? 'flex flex-row-reverse' : ''}>
                      <HeartIcon className={`${dir === 'rtl' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                      <span className={dir === 'rtl' ? 'arabic-text' : ''}>{t('nav.favorites')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className={dir === 'rtl' ? 'flex flex-row-reverse' : ''}>
                    <LogOut className={`${dir === 'rtl' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                    <span className={dir === 'rtl' ? 'arabic-text' : ''}>{t('nav.logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/signin" className={dir === 'rtl' ? 'arabic-text' : ''}>{t('nav.signin')}</Link>
              </Button>
              <Button variant="default" asChild>
                <Link to="/signup" className={dir === 'rtl' ? 'arabic-text' : ''}>{t('nav.signup')}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
