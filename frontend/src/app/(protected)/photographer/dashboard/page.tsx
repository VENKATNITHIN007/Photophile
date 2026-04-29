"use client";

import { useEffect, useState } from "react";
import { Page } from "@/components/Page";
import { DataState } from "@/components/DataState";
import { RoleGate } from "@/components/guards/RoleGate";
import { useMyPortfolioQuery, useAddPortfolioItemMutation, useMyProfileQuery, useUpdateProfileMutation } from "@/features/photographer-studio/studio.queries";


interface Profile {
  bio?: string;
  location?: string;
  specialties?: string[];
  priceFrom?: number;
}

export default function PhotographerDashboard() {
  const { data: portfolio = [], isLoading: portfolioLoading, error: portfolioError } = useMyPortfolioQuery();
  const { data: profile, isLoading: profileLoading, error: profileError } = useMyProfileQuery();

  const [activeTab, setActiveTab] = useState<"portfolio" | "profile">("portfolio");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form States
  const [newPortfolio, setNewPortfolio] = useState({ mediaUrl: "", mediaType: "image", category: "" });
  const [editProfile, setEditProfile] = useState<Profile>({ bio: "", location: "", priceFrom: 0 });

  const addPortfolioMutation = useAddPortfolioItemMutation();
  const updateProfileMutation = useUpdateProfileMutation();

  const isAddingPortfolio = addPortfolioMutation.isPending;
  const isUpdatingProfile = updateProfileMutation.isPending;

  useEffect(() => {
    if (!profile) return;
    setEditProfile({
      bio: profile.bio || "",
      location: profile.location || "",
      priceFrom: profile.priceFrom || 0,
      specialties: profile.specialties || [],
    });
  }, [profile]);

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

  const isLoading = portfolioLoading || profileLoading;

  return (
    <RoleGate allowedRoles={["photographer"]}>
      <Page>
        <Page.Body className="max-w-5xl flex-col pt-10">
          <Page.Title className="mb-8">Photographer Dashboard</Page.Title>

          {error && <DataState.Error message={error} className="mb-6" />}
          {portfolioError || profileError ? (
            <DataState.Error 
              message={(portfolioError || profileError) instanceof Error ? (portfolioError || profileError)?.message : "Failed to load dashboard data"} 
              className="mb-6" 
            />
          ) : null}
          {successMsg && <div className="bg-green-50 text-green-600 p-4 rounded-md mb-6">{successMsg}</div>}

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              {["portfolio", "profile"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as "portfolio" | "profile")}
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
            <DataState.Loading />
          ) : (
            <Page.Surface className="p-6 shadow">
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
                          onChange={(e) => setNewPortfolio({ ...newPortfolio, mediaUrl: e.target.value })}
                          disabled={isAddingPortfolio}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                          className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-black"
                          value={newPortfolio.mediaType}
                          onChange={(e) => setNewPortfolio({ ...newPortfolio, mediaType: e.target.value })}
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
                          onChange={(e) => setNewPortfolio({ ...newPortfolio, category: e.target.value })}
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
                        onChange={(e) => setEditProfile({ ...editProfile, bio: e.target.value })}
                        disabled={isUpdatingProfile}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-black"
                        value={editProfile.location || ""}
                        onChange={(e) => setEditProfile({ ...editProfile, location: e.target.value })}
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
                        onChange={(e) => setEditProfile({ ...editProfile, priceFrom: Number(e.target.value) })}
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
            </Page.Surface>
          )}
        </Page.Body>
      </Page>
    </RoleGate>
  );
}
