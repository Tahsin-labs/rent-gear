"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQueryClient } from "@tanstack/react-query";

function FailContent() {
  const searchParams = useSearchParams();
  const tranId = searchParams.get("tran_id");
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["rentals"] });
    queryClient.invalidateQueries({ queryKey: ["payments"] });
  }, [queryClient]);

  return (
    <Card className="w-full max-w-md shadow-lg border-destructive/40 text-center">
      <CardHeader>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-2">
          <AlertCircle className="h-10 w-10" />
        </div>
        <CardTitle className="text-2xl font-bold text-destructive">Payment Failed</CardTitle>
        <CardDescription>
          The transaction could not be completed by SSLCommerz.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        {tranId && (
          <div className="flex justify-between border-b py-1">
            <span>Transaction ID:</span>
            <span className="font-mono font-medium text-foreground">{tranId}</span>
          </div>
        )}
        <p>Please check your payment method balance or details and try again.</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button asChild className="w-full">
          <Link href="/dashboard/customer">
            <RotateCcw className="mr-2 h-4 w-4" /> Back to Rentals
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/40">
      <Suspense fallback={<div>Loading payment status...</div>}>
        <FailContent />
      </Suspense>
    </div>
  );
}
