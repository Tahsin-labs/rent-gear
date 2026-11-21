"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

function SuccessContent() {
  const searchParams = useSearchParams();
  const tranId = searchParams.get("tran_id") || searchParams.get("transactionId");
  const orderId = searchParams.get("orderId");
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["rentals"] });
    queryClient.invalidateQueries({ queryKey: ["payments"] });
  }, [queryClient]);

  return (
    <Card className="w-full max-w-md shadow-lg border-green-500/30 text-center">
      <CardHeader>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-2">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <CardTitle className="text-2xl font-bold text-green-700">Payment Successful!</CardTitle>
        <CardDescription>
          Your rental booking has been paid and confirmed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        {tranId && (
          <div className="flex justify-between border-b py-1">
            <span>Transaction ID:</span>
            <span className="font-mono font-medium text-foreground">{tranId}</span>
          </div>
        )}
        {orderId && (
          <div className="flex justify-between border-b py-1">
            <span>Rental/Order ID:</span>
            <span className="font-mono font-medium text-foreground">{orderId}</span>
          </div>
        )}
        <p className="pt-2">
          You can inspect your rental status and schedule in your customer dashboard.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Link href="/dashboard/customer" className={cn(buttonVariants(), "w-full")}>
          Go to Customer Dashboard <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/40">
      <Suspense fallback={<div>Loading payment confirmation...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
