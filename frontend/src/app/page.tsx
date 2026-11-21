import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Compass, ShieldCheck, Zap, Repeat } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28 px-4 text-center bg-gradient-to-b from-muted/50 to-background border-b">
          <div className="container mx-auto max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
              <Compass className="h-3.5 w-3.5" /> Peer-to-Peer Gear Sharing Platform
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
              Rent Outdoor & Tech Gear <br />
              <span className="text-primary">Without Buying Expensive Equipment</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Find cameras, drones, camping equipment, audio gear, and more. Rent directly from trusted providers or list your own idle equipment.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button size="lg" asChild>
                <Link href="/register">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Sign In to Dashboard</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="py-16 px-4 container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border bg-card/60 space-y-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg">Instant Booking & Verification</h3>
              <p className="text-sm text-muted-foreground">
                Check dates and reserve gear with transparent daily pricing and verified providers.
              </p>
            </div>
            <div className="p-6 rounded-xl border bg-card/60 space-y-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg">Secure SSLCommerz Payments</h3>
              <p className="text-sm text-muted-foreground">
                Transactions are securely processed with cards, mobile banking, and instant confirmations.
              </p>
            </div>
            <div className="p-6 rounded-xl border bg-card/60 space-y-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Repeat className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg">Monetize Your Idle Gear</h3>
              <p className="text-sm text-muted-foreground">
                Turn cameras, audio interfaces, and camping tools into a continuous stream of rental income.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
