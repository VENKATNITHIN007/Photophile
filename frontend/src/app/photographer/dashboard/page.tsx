"use client";

import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { apiClient } from "@/lib/api-client";

interface Booking {
  _id: string;
  photographerId: string;
  userId: { _id?: string; fullName?: string; email?: string } | string;
  eventDate: string;
  status: string;
  message?: string;
}

interface PortfolioItem {
  _id: string;
  mediaUrl: string;
  mediaType: string;
  category?: string;
}

interface Profile {
  bio?: string;
  location?: string;
  specialties?: string[];
  priceFrom?: number;
}

export default function PhotographerDashboard() {
  
  
  // Data States
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  
  
  // UI States
  const [activeTab, setActiveTab] = useState<"bookings" | "portfolio" | "profile">("bookings");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form States
  const [newPortfolio, setNewPortfolio] = useState({ mediaUrl: "", mediaType: "image", category: "" });
  const [editProfile, setEditProfile] = useState<Profile>({ bio: "", location: "", priceFrom: 0 });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [bookingsRes, portfolioRes, profileRes] = await Promise.all([
        apiClient.get("/bookings/photographer").catch((e) => {
          if (e.response?.status === 404) {
             return apiClient.get("/bookings/requests/all");
          }
          throw e;
        }),
        apiClient.get("/portfolio").catch(() => ({ data: { data: [] } })),
        apiClient.get("/photographers/profile").catch(() => ({ data: { data: {} } }))
      ]);

      setBookings(bookingsRes.data?.data || []);
      setPortfolio(portfolioRes.data?.data || []);
      
      const profData = profileRes.data?.data || {};
      
      setEditProfile({
        bio: profData.bio || "",
        location: profData.location || "",
        priceFrom: profData.priceFrom || 0,
        specialties: profData.specialties || []
      });

    } catch {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    try {
      await apiClient.patch(`/bookings/${bookingId}/status`, { status });
      setSuccessMsg(`Booking ${status} successfully`);
      fetchDashboardData();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch {
      setError("Failed to update booking status");
    }
  };

  const handleAddPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post("/portfolio", newPortfolio).catch(err => {
        if (err.response?.status === 404) {
          return apiClient.post("/portfolio/add", newPortfolio);
        }
        throw err;
      });
      setSuccessMsg("Portfolio item added");
      setNewPortfolio({ mediaUrl: "", mediaType: "image", category: "" });
      fetchDashboardData();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch {
      setError("Failed to add portfolio item");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.put("/photographers/profile", editProfile).catch(err => {
         if (err.response?.status === 404 || err.response?.status === 405) {
             return apiClient.patch("/photographers/update", editProfile);
         }
         throw err;
      });
      setSuccessMsg("Profile updated successfully");
      fetchDashboardData();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch {
      setError("Failed to update profile");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["photographer"]}>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Photographer Dashboard</h1>

          {error && <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">{error}</div>}
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

          {loading ? (
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
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleUpdateBookingStatus(booking._id, 'rejected')}
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
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
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                          className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-black"
                          value={newPortfolio.mediaType}
                          onChange={(e) => setNewPortfolio({...newPortfolio, mediaType: e.target.value})}
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
                        />
                      </div>
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      Add to Portfolio
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
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-black"
                        value={editProfile.location || ""}
                        onChange={(e) => setEditProfile({...editProfile, location: e.target.value})}
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
                      />
                    </div>

                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      Save Changes
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
