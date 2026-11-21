import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Compass } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
      <Compass className="h-16 w-16 text-muted-foreground/50 mb-4 animate-bounce" />
      <h2 className="text-3xl font-bold tracking-tight mb-2">Page Not Found</h2>
      <p className="text-muted-foreground text-sm max-w-md mb-6">
        The gear or destination you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className={cn(buttonVariants())}>
        Back to Homepage
      </Link>
    </div>
  );
}
