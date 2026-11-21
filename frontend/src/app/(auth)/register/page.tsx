"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { registerSchema, RegisterFormData } from "@/lib/validations/auth";
import { api } from "@/lib/api/endpoints";

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "CUSTOMER",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (values: RegisterFormData) => {
    try {
      await api.auth.register({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        profile: {
          phone: values.phone,
          bio: values.bio,
        },
      });

      toast.success("Account created successfully! Please sign in.");
      router.push("/login");
    } catch (err: unknown) {
      toast.error((err as { message?: string })?.message || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/40">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Create your GearUp Account</CardTitle>
          <CardDescription>Join our platform to rent or share outdoor & tech gear</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>I want to</Label>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={selectedRole === "CUSTOMER" ? "default" : "outline"}
                  onClick={() => setValue("role", "CUSTOMER")}
                  className="w-full"
                >
                  Rent Gear (Customer)
                </Button>
                <Button
                  type="button"
                  variant={selectedRole === "PROVIDER" ? "default" : "outline"}
                  onClick={() => setValue("role", "PROVIDER")}
                  className="w-full"
                >
                  List Gear (Provider)
                </Button>
              </div>
              {errors.role && (
                <p className="text-sm font-medium text-destructive">{errors.role.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" {...register("name")} />
              {errors.name && (
                <p className="text-sm font-medium text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
              {errors.email && (
                <p className="text-sm font-medium text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
              {errors.password && (
                <p className="text-sm font-medium text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input id="phone" placeholder="+123456789" {...register("phone")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio (optional)</Label>
                <Input id="bio" placeholder="Outdoor enthusiast..." {...register("bio")} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Register"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-primary underline underline-offset-4">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
