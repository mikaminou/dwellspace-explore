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
import { SearchIcon, MapIcon, HeartIcon, UserIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { 
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton
} from "@clerk/clerk-react";

export function MainNav() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="text-xl font-bold">DwellSpace</span>
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
                          Properties for Sale
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
                        <div className="text-sm font-medium leading-none">Rent</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Browse rental properties
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link to="/map" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Map View</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Explore properties on the map
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button variant="ghost" asChild>
                <Link to="/search" className="flex items-center gap-2">
                  <SearchIcon className="h-4 w-4" />
                  Search
                </Link>
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button variant="ghost" asChild>
                <Link to="/map" className="flex items-center gap-2">
                  <MapIcon className="h-4 w-4" />
                  Map
                </Link>
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="ml-auto flex items-center space-x-4">
          <SignedIn>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/favorites">
                <HeartIcon className="h-5 w-5" />
                <span className="sr-only">Favorites</span>
              </Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Button variant="ghost" asChild>
              <SignInButton mode="modal">
                <span>Sign In</span>
              </SignInButton>
            </Button>
            <Button variant="default" asChild>
              <SignUpButton mode="modal">
                <span>Sign Up</span>
              </SignUpButton>
            </Button>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
