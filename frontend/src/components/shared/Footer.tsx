import Link from "next/link";
import { Compass } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t bg-muted/30 py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <Compass className="h-4 w-4 text-primary" /> GearUp
        </div>
        <p>© {new Date().getFullYear()} GearUp Platform. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/" className="hover:underline">Explore</Link>
          <Link href="/login" className="hover:underline">Sign In</Link>
          <Link href="/register" className="hover:underline">Register</Link>
        </div>
      </div>
    </footer>
  );
}
