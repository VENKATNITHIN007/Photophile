"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Mail, Camera } from "lucide-react";
import Link from "next/link";
import { AxiosError } from "axios";
import { useAuth } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/protected-route";
import { apiClient } from "@/lib/api-client";

interface Photographer {
  _id: string;
  username: string;
  location: string;
  priceFrom: number;
  userId: {
    _id: string;
    fullName: string;
    avatar: string;
  };
}

interface Booking {
  _id: string;
  photographerId: Photographer;
  eventDate: string;
  status: "pending" | "accepted" | "rejected" | "completed" | "cancelled";
  message: string;
  createdAt: string;
}

export default function UserDashboard() {
  const { user, checkAuth, isEmailVerified, resendVerificationEmail } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Profile form state
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatar, setAvatar] = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [resendingEmail, setResendingEmail] = useState(false);

  const { success, error: showError } = useToast();

  useEffect(() => {
    if (user) {
      setFullName(user.name || "");
      // @ts-expect-error - avatar exists on backend - phoneNumber and avatar might exist on user object if returned from backend
      setPhoneNumber(user.phoneNumber || "");
      // @ts-expect-error - avatar exists on backend
      setAvatar(user.avatar || "");
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/bookings/my-bookings");
      setBookings(res.data.data || []);
    } catch (error: unknown) {
      setError((error as AxiosError<{message: string}>).response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdatingProfile(true);
      setProfileSuccess("");
      await apiClient.put("/users/profile", { fullName, phoneNumber, avatar });
      setProfileSuccess("Profile updated successfully");
      await checkAuth(); // refresh user data
    } catch (error: unknown) {
      setError((error as AxiosError<{message: string}>).response?.data?.message || "Failed to update profile");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "accepted": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "rejected":
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleResendVerification = async () => {
    try {
      setResendingEmail(true);
      await resendVerificationEmail();
      success("Verification email sent", "Check your inbox for the verification link");
    } catch (err) {
      showError("Failed to send verification email", "Please try again later");
    } finally {
      setResendingEmail(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["user", "admin"]}>
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Email Verification Banner */}
        {!isEmailVerified && (
          <Alert variant="destructive" className="border-amber-500 bg-amber-50 text-amber-900 [&>svg]:text-amber-700">
            <AlertTriangle className="h-4 w-4 text-amber-700" />
            <AlertTitle className="text-amber-900">Email Not Verified</AlertTitle>
            <AlertDescription className="text-amber-800">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-1">
                <span>Please verify your email address to unlock all features.</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResendVerification}
                  disabled={resendingEmail}
                  className="shrink-0 border-amber-600 text-amber-900 hover:bg-amber-100 hover:text-amber-900"
                >
                  {resendingEmail ? (
                    <>
                      <Mail className="mr-2 h-4 w-4 animate-pulse" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Resend verification email
                    </>
                  )}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Profile Settings</h2>
              
              {profileSuccess && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded text-sm">
                  {profileSuccess}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={updatingProfile}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {updatingProfile ? "Updating..." : "Update Profile"}
                </button>

                {/* Become Photographer Button */}
                {user?.role === "user" && (
                  <div className="pt-4 border-t border-gray-200 mt-4">
                    <p className="text-sm text-gray-600 mb-3">
                      Want to offer your photography services?
                    </p>
                    <Link href="/photographer/onboard">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-purple-600 text-purple-700 hover:bg-purple-50"
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Become a Photographer
                      </Button>
                    </Link>
                  </div>
                )}
              </form>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">My Bookings</h2>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  You don&apos;t have any bookings yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking._id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">
                            {booking.photographerId?.userId?.fullName || "Photographer"}
                          </h3>
                          <span className={`text-xs px-2 py-1 rounded-full uppercase font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Date:</span> {new Date(booking.eventDate).toLocaleDateString()}
                        </p>
                        {booking.message && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            &quot;{booking.message}&quot;
                          </p>
                        )}
                      </div>
                      
                      {booking.status === "pending" && (
                        <div className="flex gap-2 shrink-0">
                          <button 
                            className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                            onClick={async () => {
                              if (confirm("Are you sure you want to cancel this booking?")) {
                                try {
                                  await apiClient.delete(`/bookings/${booking._id}`);
                                  fetchBookings();
                                } catch (error: unknown) {
                                  setError((error as AxiosError<{message: string}>).response?.data?.message || "Failed to cancel booking");
                                }
                              }
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
