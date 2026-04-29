"use client";

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
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
  "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
  "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal",
  "Visakhapatnam", "Patna", "Vadodara", "Ghaziabad", "Ludhiana",
].map((city) => ({ label: city, value: city.toLowerCase() }));

const SPECIALTIES = [
  "Wedding", "Portrait", "Event", "Commercial", "Fashion",
  "Nature", "Real Estate", "Food", "Sports", "Product",
  "Newborn", "Maternity", "Corporate", "Concert",
].map((spec) => ({ label: spec, value: spec.toLowerCase() }));

export default function PhotographerOnboardingPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const { user, loading } = useAuth();
  const createProfileMutation = useCreateProfileMutation();

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
      success("Profile created successfully!");
      router.replace("/photographer/dashboard");
    } catch (err: unknown) {
      showError((err as Error).message || "Failed to create profile");
    }
  };

  return (
    <RoleGate allowedRoles={["user"]} redirectTo="/photographer/dashboard">
      <div className="flex min-h-screen flex-col items-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-extrabold">Become a Photographer</CardTitle>
            <CardDescription className="mt-2 text-center text-lg">
              Set up your profile to start showcasing your work. Keep it simple for now!
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

              <div className="flex items-center justify-end space-x-4 border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={createProfileMutation.isPending}
                >
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
