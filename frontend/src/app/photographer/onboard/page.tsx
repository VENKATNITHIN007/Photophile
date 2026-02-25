"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { apiClient } from "@/lib/api-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { photographerOnboardingSchema, PhotographerOnboardingInput } from "@/lib/validations/photographer";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";
import { FormMultiSelect } from "@/components/forms/FormMultiSelect";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", 
  "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow", 
  "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", 
  "Visakhapatnam", "Patna", "Vadodara", "Ghaziabad", "Ludhiana"
].map(city => ({ label: city, value: city.toLowerCase() }));

const SPECIALTIES = [
  "Wedding", "Portrait", "Event", "Commercial", "Fashion", 
  "Nature", "Real Estate", "Food", "Sports", "Product", 
  "Newborn", "Maternity", "Corporate", "Concert"
].map(spec => ({ label: spec, value: spec.toLowerCase() }));

export default function PhotographerOnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { success, error: showError } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<PhotographerOnboardingInput>({
    resolver: zodResolver(photographerOnboardingSchema),
    defaultValues: {
      username: "",
      location: "",
      specialties: [],
      priceFrom: undefined,
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const onSubmit = async (data: PhotographerOnboardingInput) => {
    setSubmitting(true);

    try {
      await apiClient.post("/photographers", {
        username: data.username,
        location: data.location,
        specialties: data.specialties,
        priceFrom: data.priceFrom ? Number(data.priceFrom) : undefined,
      });

      success("Profile created successfully!");
      router.push("/dashboard");
    } catch (err: unknown) {
      const errorMsg = ((err as {response?: {data?: {message?: string}}}).response?.data?.message) || (err as Error).message || "Failed to create profile";
      showError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold text-center">Become a Photographer</CardTitle>
          <CardDescription className="text-center text-lg mt-2">
            Set up your profile to start receiving bookings. Keep it simple for now!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-6">
                <FormInput
                  control={form.control}
                  name="username"
                  label="Username"
                  placeholder="your_unique_handle"
                  description="This will be your unique URL: lensloom.com/photographers/[username]"
                  disabled={submitting}
                />

                <FormSelect
                  control={form.control}
                  name="location"
                  label="Primary Location"
                  placeholder="Select a city"
                  options={CITIES}
                  disabled={submitting}
                />

                <FormMultiSelect
                  control={form.control}
                  name="specialties"
                  label="Specialties"
                  options={SPECIALTIES}
                  description="Select up to 3 specialties."
                  disabled={submitting}
                />

                <FormInput
                  control={form.control}
                  name="priceFrom"
                  label="Starting Price ($/hr)"
                  type="number"
                  placeholder="e.g. 150"
                  description="Optional. You can always update this later."
                  disabled={submitting}
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="px-8"
                >
                  {submitting ? "Creating Profile..." : "Create Profile"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}