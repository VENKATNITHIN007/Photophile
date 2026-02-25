"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";
import { apiClient } from "@/lib/api-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { consultationSchema, ConsultationInput } from "@/lib/validations/consultation";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  _id: string;
  fullName: string;
  avatar: string | null;
  email: string;
}

interface PhotographerProfile {
  _id: string;
  userId: UserProfile;
  username: string;
  bio?: string;
  location?: string;
  specialties?: string[];
  priceFrom?: number;
}

const EVENT_TYPES = [
  { label: "Wedding", value: "wedding" },
  { label: "Portrait", value: "portrait" },
  { label: "Event", value: "event" },
  { label: "Commercial", value: "commercial" },
  { label: "Family", value: "family" },
  { label: "Other", value: "other" },
];

export default function BookPhotographerPage({
  params,
}: {
  params: Promise<{ photographerId: string }>;
}) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { success, error: showError } = useToast();
  
  const resolvedParams = use(params);
  const photographerId = resolvedParams.photographerId;

  const [profile, setProfile] = useState<PhotographerProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ConsultationInput>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      eventDate: "",
      eventType: "wedding",
      location: "",
      phoneNumber: "",
      message: "",
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/photographers/${photographerId}`);
        if (!res.ok) {
          throw new Error("Photographer not found");
        }
        const data = await res.json();
        setProfile(data.data);
      } catch (err: unknown) {
        setErrorProfile((err as Error).message || "Failed to load photographer");
      } finally {
        setLoadingProfile(false);
      }
    }
    fetchProfile();
  }, [photographerId]);

  const onSubmit = async (data: ConsultationInput) => {
    setSubmitting(true);

    try {
      const combinedMessage = `Event Type: ${data.eventType}\nLocation: ${data.location}\nPhone: ${data.phoneNumber}\n\n${data.message || 'No additional details provided.'}`;

      await apiClient.post("/bookings", {
        photographerId: profile?._id,
        eventDate: new Date(data.eventDate).toISOString(),
        message: combinedMessage,
      });

      setIsSuccess(true);
      success("Booking request sent successfully");
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } catch (err: unknown) {
      const errorMsg = ((err as {response?: {data?: {message?: string}}}).response?.data?.message) || (err as Error).message || "Failed to submit booking";
      showError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || (loadingProfile && user)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (errorProfile || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-700">{errorProfile}</p>
        <Button onClick={() => router.back()} variant="outline" className="mt-4">
          Go back
        </Button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-medium text-gray-900 mb-2">Booking Request Sent!</h2>
          <p className="text-gray-500 mb-6">
            Your booking request has been successfully sent to {profile.userId.fullName}. They will review it and get back to you shortly.
          </p>
          <Button
            onClick={() => router.push("/photographers")}
            className="w-full"
          >
            Back to Photographers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Book a Session
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Fill out the form below to request a booking with {profile.userId.fullName}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center space-x-4">
            {profile.userId.avatar ? (
              <Image
                src={profile.userId.avatar}
                alt={profile.userId.fullName}
                width={64}
                height={64}
                className="rounded-full object-cover h-16 w-16"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500 shrink-0">
                {profile.userId.fullName.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="text-lg font-medium text-gray-900">{profile.userId.fullName}</h3>
              {profile.location && <p className="text-sm text-gray-500">{profile.location}</p>}
              {profile.priceFrom && <p className="text-sm font-medium text-gray-900 mt-1">From ${profile.priceFrom}/hr</p>}
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <FormInput
                    control={form.control}
                    name="eventDate"
                    label="Event Date"
                    type="date"
                    disabled={submitting}
                  />
                </div>

                <div className="sm:col-span-1">
                  <FormSelect
                    control={form.control}
                    name="eventType"
                    label="Event Type"
                    options={EVENT_TYPES}
                    disabled={submitting}
                  />
                </div>

                <div className="sm:col-span-1">
                  <FormInput
                    control={form.control}
                    name="location"
                    label="Location"
                    placeholder="E.g., Central Park, NY"
                    disabled={submitting}
                  />
                </div>

                <div className="sm:col-span-1">
                  <FormInput
                    control={form.control}
                    name="phoneNumber"
                    label="Phone Number"
                    placeholder="Your contact number"
                    type="tel"
                    disabled={submitting}
                  />
                </div>

                <div className="sm:col-span-2">
                  <FormTextarea
                    control={form.control}
                    name="message"
                    label="Additional Details"
                    placeholder="Tell the photographer about your vision, schedule, or any specific requests..."
                    description="Briefly describe what you're looking for."
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-4">
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
                >
                  {submitting ? "Submitting..." : "Send Request"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}