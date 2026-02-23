"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";
import { apiClient } from "@/lib/api-client";

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

export default function BookPhotographerPage({
  params,
}: {
  params: Promise<{ photographerId: string }>;
}) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const photographerId = resolvedParams.photographerId;

  const [profile, setProfile] = useState<PhotographerProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState("");

  const [date, setDate] = useState("");
  const [eventType, setEventType] = useState("wedding");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);

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

  if (authLoading || (loadingProfile && user)) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (errorProfile || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-700">{errorProfile}</p>
        <button onClick={() => router.back()} className="mt-4 text-blue-600 hover:underline">
          Go back
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!date) {
      setSubmitError("Event date is required");
      return;
    }

    const selectedDate = new Date(date);
    if (selectedDate <= new Date()) {
      setSubmitError("Event date must be in the future");
      return;
    }

    if (!eventType || !location) {
      setSubmitError("Event type and location are required");
      return;
    }

    setSubmitting(true);

    try {
      const combinedMessage = `Event Type: ${eventType}\nLocation: ${location}\n\n${message}`;

      await apiClient.post("/bookings", {
        photographerId: profile._id,
        eventDate: new Date(date).toISOString(),
        message: combinedMessage,
      });

      setSuccess(true);
      // Automatically redirect after a few seconds
      setTimeout(() => {
        router.push("/dashboard"); // or maybe /my-bookings
      }, 3000);
    } catch (err: unknown) {
      setSubmitError(((err as {response?: {data?: {message?: string}}}).response?.data?.message) || (err as Error).message || "Failed to submit booking");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
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
          <button
            onClick={() => router.push("/photographers")}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800"
          >
            Back to Photographers
          </button>
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

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {submitError}
              </div>
            )}

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Event Date *
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    name="date"
                    id="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label htmlFor="eventType" className="block text-sm font-medium text-gray-700">
                  Event Type *
                </label>
                <div className="mt-1">
                  <select
                    id="eventType"
                    name="eventType"
                    required
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border bg-white"
                  >
                    <option value="wedding">Wedding</option>
                    <option value="portrait">Portrait</option>
                    <option value="event">Event</option>
                    <option value="commercial">Commercial</option>
                    <option value="family">Family</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="location"
                    id="location"
                    required
                    placeholder="E.g., Central Park, NY or 123 Main St"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Additional Details
                </label>
                <div className="mt-1">
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Tell the photographer about your vision, schedule, or any specific requests..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Briefly describe what you&apos;re looking for.
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Send Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
