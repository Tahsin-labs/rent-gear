"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";
import {
  Package,
  CalendarCheck2,
  CreditCard,
  Settings,
  Users,
  Layers,
  ShoppingBag,
} from "lucide-react";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const customerItems: SidebarItem[] = [
    { title: "My Rentals", href: "/dashboard/customer", icon: CalendarCheck2 },
    { title: "Browse Gear", href: "/", icon: ShoppingBag },
  ];

  const providerItems: SidebarItem[] = [
    { title: "My Gear Items", href: "/dashboard/provider", icon: Package },
    { title: "Rental Orders", href: "/dashboard/provider/orders", icon: CalendarCheck2 },
  ];

  const adminItems: SidebarItem[] = [
    { title: "Overview", href: "/dashboard/admin", icon: Layers },
    { title: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { title: "All Gear", href: "/dashboard/admin/gear", icon: Package },
    { title: "All Rentals", href: "/dashboard/admin/rentals", icon: CalendarCheck2 },
  ];

  let items = customerItems;
  if (user?.role === "PROVIDER") items = providerItems;
  if (user?.role === "ADMIN") items = adminItems;

  return (
    <aside className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r bg-muted/10 p-4">
      <div className="mb-4 px-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {user?.role} Portal
        </h2>
      </div>
      <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
