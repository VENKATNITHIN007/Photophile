"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { photographerOnboardingSchema, type PhotographerOnboardingInput } from "@/lib/validations/photographer";
import { Form } from "@/components/Form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RoleGate } from "@/components/guards/RoleGate";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/features/auth";
import { useCreateProfileMutation } from "@/features/photographer-studio/studio.queries";

const CITIES = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
].map((city) => ({ label: city, value: city.toLowerCase() }));

const SPECIALTIES = [
  "Wedding",
  "Portrait",
  "Event",
  "Commercial",
  "Fashion",
  "Food",
  "Product",
  "Corporate",
].map((specialty) => ({ label: specialty, value: specialty.toLowerCase() }));

export default function PhotographerOnboardingPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const { user, loading } = useAuth();
  const createProfileMutation = useCreateProfileMutation();

  useEffect(() => {
    if (loading || !user) {
      return;
    }

    if (user.role === "photographer") {
      router.replace("/photographer/dashboard");
    }
  }, [loading, user, router]);

  const form = useForm<PhotographerOnboardingInput>({
    resolver: zodResolver(photographerOnboardingSchema),
    defaultValues: {
      username: "",
      location: "",
      specialties: [],
      priceFrom: undefined,
    },
  });

  const onSubmit = async (data: PhotographerOnboardingInput) => {
    try {
      await createProfileMutation.mutateAsync({
        username: data.username,
        location: data.location,
        specialties: data.specialties,
        priceFrom: data.priceFrom ? Number(data.priceFrom) : undefined,
      });

      success("Profile created", "Now upload your portfolio.");
      router.replace("/photographer/dashboard");
    } catch (error) {
      showError((error as Error).message || "Failed to create profile");
    }
  };

  return (
    <RoleGate allowedRoles={["user"]} redirectTo="/photographer/dashboard">
      <div className="flex min-h-screen items-start justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold">Become a Photographer</CardTitle>
            <CardDescription className="text-center text-base">
              Set up your public profile. You can update details later from your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Form.Input
                control={form.control}
                name="username"
                label="Username"
                placeholder="your_handle"
                description="Public URL: /photographers/[username]"
                disabled={createProfileMutation.isPending}
              />

              <Form.Select
                control={form.control}
                name="location"
                label="Primary location"
                placeholder="Select city"
                options={CITIES}
                disabled={createProfileMutation.isPending}
              />

              <Form.MultiSelect
                control={form.control}
                name="specialties"
                label="Specialties"
                options={SPECIALTIES}
                description="Select up to 3"
                disabled={createProfileMutation.isPending}
              />

              <Form.Input
                control={form.control}
                name="priceFrom"
                label="Starting price ($/hr)"
                type="number"
                placeholder="e.g. 150"
                disabled={createProfileMutation.isPending}
              />

              <div className="flex items-center justify-end gap-3 border-t pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={createProfileMutation.isPending}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-amber-600 text-white hover:bg-amber-700" disabled={createProfileMutation.isPending}>
                  {createProfileMutation.isPending ? "Creating..." : "Create profile"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}
