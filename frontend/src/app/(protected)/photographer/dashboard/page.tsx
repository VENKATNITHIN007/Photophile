"use client";

import { useEffect, useState } from "react";
import { RoleGate } from "@/components/shared/RoleGate";
import { usePhotographerBookingsQuery, useUpdateBookingStatusMutation } from "@/lib/query/bookings";
import { useMyPortfolioQuery, useAddPortfolioItemMutation } from "@/lib/query/portfolio";
import { useMyPhotographerProfileQuery, useUpdatePhotographerProfileMutation } from "@/lib/query/photographer-profile";


interface Profile {
  bio?: string;
  location?: string;
  specialties?: string[];
  priceFrom?: number;
}

export default function PhotographerDashboard() {
  
  
  const { data: bookings = [], isLoading: bookingsLoading, error: bookingsError } = usePhotographerBookingsQuery();
  const { data: portfolio = [], isLoading: portfolioLoading, error: portfolioError } = useMyPortfolioQuery();
  const { data: profile, isLoading: profileLoading, error: profileError } = useMyPhotographerProfileQuery();

  const [activeTab, setActiveTab] = useState<"bookings" | "portfolio" | "profile">("bookings");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form States
  const [newPortfolio, setNewPortfolio] = useState({ mediaUrl: "", mediaType: "image", category: "" });
  const [editProfile, setEditProfile] = useState<Profile>({ bio: "", location: "", priceFrom: 0 });
  const updateBookingStatusMutation = useUpdateBookingStatusMutation();
  const addPortfolioMutation = useAddPortfolioItemMutation();
  const updateProfileMutation = useUpdatePhotographerProfileMutation();
  const isAddingPortfolio = addPortfolioMutation.isPending;
  const isUpdatingProfile = updateProfileMutation.isPending;
  const isUpdatingStatus = updateBookingStatusMutation.isPending;

  useEffect(() => {
    if (!profile) return;
    setEditProfile({
      bio: profile.bio || "",
      location: profile.location || "",
      priceFrom: profile.priceFrom || 0,
      specialties: profile.specialties || [],
    });
  }, [profile]);

  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    try {
      await updateBookingStatusMutation.mutateAsync({ bookingId, status });
      setSuccessMsg(`Booking ${status} successfully`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch {
      setError("Failed to update booking status");
    }
  };

  const handleAddPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addPortfolioMutation.mutateAsync(newPortfolio);
      setSuccessMsg("Portfolio item added");
      setNewPortfolio({ mediaUrl: "", mediaType: "image", category: "" });
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch {
      setError("Failed to add portfolio item");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfileMutation.mutateAsync(editProfile);
      setSuccessMsg("Profile updated successfully");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch {
      setError("Failed to update profile");
    }
  };

  const isLoading = bookingsLoading || portfolioLoading || profileLoading;

  return (
    <RoleGate allowedRoles={["photographer"]}>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Photographer Dashboard</h1>

          {error && <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">{error}</div>}
          {bookingsError || portfolioError || profileError ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
              {(bookingsError || portfolioError || profileError) instanceof Error
                ? (bookingsError || portfolioError || profileError)?.message
                : "Failed to load dashboard data"}
            </div>
          ) : null}
          {successMsg && <div className="bg-green-50 text-green-600 p-4 rounded-md mb-6">{successMsg}</div>}

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              {["bookings", "portfolio", "profile"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as "bookings" | "portfolio" | "profile")}
                  className={`
                    whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm capitalize
                    ${activeTab === tab 
                      ? "border-blue-500 text-blue-600" 
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6">
              {/* Bookings Tab */}
              {activeTab === "bookings" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-black">Incoming Bookings</h2>
                  {bookings.length === 0 ? (
                    <p className="text-gray-500">No bookings found.</p>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <div key={booking._id} className="border rounded-md p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                          <div>
                            <p className="font-medium text-black">
                              Date: {new Date(booking.eventDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              Client: {(typeof booking.userId === 'object' && booking.userId !== null ? booking.userId.fullName || booking.userId.email : booking.userId) || 'Unknown'}
                            </p>
                            {booking.message && (
                              <p className="text-sm text-gray-500 mt-1 italic">&quot;{booking.message}&quot;</p>
                            )}
                            <span className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full ${
                              booking.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                          
                          {booking.status === 'pending' && (
                            <div className="mt-4 sm:mt-0 flex space-x-2">
                              <button
                                onClick={() => handleUpdateBookingStatus(booking._id, 'accepted')}
                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                                disabled={isUpdatingStatus}
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleUpdateBookingStatus(booking._id, 'rejected')}
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                                disabled={isUpdatingStatus}
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Portfolio Tab */}
              {activeTab === "portfolio" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-black">Manage Portfolio</h2>
                  
                  {/* Add New Item */}
                  <form onSubmit={handleAddPortfolio} className="mb-8 bg-gray-50 p-4 rounded-md border">
                    <h3 className="font-medium mb-3 text-black">Add New Media</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Media URL</label>
                        <input
                          type="url"
                          required
                          className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-black"
                          placeholder="https://example.com/image.jpg"
                          value={newPortfolio.mediaUrl}
                          onChange={(e) => setNewPortfolio({...newPortfolio, mediaUrl: e.target.value})}
                          disabled={isAddingPortfolio}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                          className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-black"
                          value={newPortfolio.mediaType}
                          onChange={(e) => setNewPortfolio({...newPortfolio, mediaType: e.target.value})}
                          disabled={isAddingPortfolio}
                        >
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <input
                          type="text"
                          className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-black"
                          placeholder="e.g. Wedding, Portrait"
                          value={newPortfolio.category}
                          onChange={(e) => setNewPortfolio({...newPortfolio, category: e.target.value})}
                          disabled={isAddingPortfolio}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
                      disabled={isAddingPortfolio}
                    >
                      {isAddingPortfolio ? "Adding..." : "Add to Portfolio"}
                    </button>
                  </form>

                  {/* Portfolio Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {portfolio.map((item) => (
                      <div key={item._id} className="border rounded-md overflow-hidden relative group">
                        {item.mediaType === 'video' ? (
                          <div className="aspect-square bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">Video</span>
                          </div>
                        ) : (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={item.mediaUrl} alt={item.category || 'Portfolio item'} className="w-full aspect-square object-cover" />
                        )}
                        {item.category && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1 text-xs text-center">
                            {item.category}
                          </div>
                        )}
                      </div>
                    ))}
                    {portfolio.length === 0 && (
                      <p className="col-span-full text-gray-500">No portfolio items found.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-black">Edit Profile</h2>
                  <form onSubmit={handleUpdateProfile} className="max-w-lg space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea
                        className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-black min-h-[100px]"
                        value={editProfile.bio || ""}
                        onChange={(e) => setEditProfile({...editProfile, bio: e.target.value})}
                        disabled={isUpdatingProfile}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-black"
                        value={editProfile.location || ""}
                        onChange={(e) => setEditProfile({...editProfile, location: e.target.value})}
                        disabled={isUpdatingProfile}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Starting Price ($)</label>
                      <input
                        type="number"
                        min="0"
                        className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-black"
                        value={editProfile.priceFrom || 0}
                        onChange={(e) => setEditProfile({...editProfile, priceFrom: Number(e.target.value)})}
                        disabled={isUpdatingProfile}
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
                      disabled={isUpdatingProfile}
                    >
                      {isUpdatingProfile ? "Saving..." : "Save Changes"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </RoleGate>
  );
}
