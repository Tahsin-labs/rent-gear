"use client";

import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Compass, LayoutDashboard, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, logout } = useAuth();

  const getDashboardLink = () => {
    if (!user) return "/login";
    return `/dashboard/${user.role.toLowerCase()}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
          <Compass className="h-6 w-6" />
          <span>GearUp</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-primary">
            Explore Gear
          </Link>
          {user?.role === "PROVIDER" && (
            <Link href="/dashboard/provider" className="transition-colors hover:text-primary">
              Manage Listings
            </Link>
          )}
          {user?.role === "CUSTOMER" && (
            <Link href="/dashboard/customer" className="transition-colors hover:text-primary">
              My Rentals
            </Link>
          )}
          {user?.role === "ADMIN" && (
            <Link href="/dashboard/admin" className="transition-colors hover:text-primary">
              Admin Panel
            </Link>
          )}
        </nav>

        {/* User actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="relative h-9 w-9 rounded-full outline-none focus:ring-2 focus:ring-ring">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-primary pt-1">
                      {user.role}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => window.location.href = getDashboardLink()}>
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }))}>
                Sign In
              </Link>
              <Link href="/register" className={cn(buttonVariants())}>
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu sheet */}
        <div className="flex md:hidden items-center gap-2">
          <Sheet>
            <SheetTrigger className="p-2 rounded-md hover:bg-muted">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-primary">
                  <Compass className="h-5 w-5" /> GearUp
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-6">
                <Link href="/" className="text-base font-medium hover:text-primary">
                  Explore Gear
                </Link>
                {user ? (
                  <>
                    <Link href={getDashboardLink()} className="text-base font-medium hover:text-primary">
                      Dashboard ({user.role})
                    </Link>
                    <Button variant="destructive" onClick={logout} className="mt-4">
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className={cn(buttonVariants(), "w-full mt-4")}>
                      Sign In
                    </Link>
                    <Link href="/register" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
                      Register
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
