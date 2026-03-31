"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Mail, Camera } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useUpdateProfileMutation } from "@/features/auth/queries/auth.queries";
import { RoleGate } from "@/components/shared/RoleGate";
export default function UserDashboard() {
  const { user, checkAuth, isEmailVerified, resendVerificationEmail } = useAuth();
  const updateProfileMutation = useUpdateProfileMutation();

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatar, setAvatar] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [resendingEmail, setResendingEmail] = useState(false);

  const { success, error: showError } = useToast();

  useEffect(() => {
    if (user) {
      setFullName(user.name || "");
      setPhoneNumber(user.phoneNumber || "");
      setAvatar(user.avatar || "");
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setProfileSuccess("");
      await updateProfileMutation.mutateAsync({ fullName, phoneNumber, avatar });
      setProfileSuccess("Profile updated successfully");
    } catch (unusedError: unknown) {
      showError("Failed to update profile");
    } finally {
      updateProfileMutation.reset();
    }
  };

  const handleResendVerification = async () => {
    try {
      setResendingEmail(true);
      await resendVerificationEmail();
      success("Verification email sent", "Check your inbox for the verification link");
    } catch {
      showError("Failed to send verification email", "Please try again later");
    } finally {
      setResendingEmail(false);
    }
  };

  return (
    <RoleGate allowedRoles={["user", "admin"]}>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>

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

        <div className="bg-white shadow-xl border border-gray-100 rounded-2xl p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 border-b pb-4 text-gray-800">Profile Settings</h2>

          {profileSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-1">
              {profileSuccess}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Avatar URL</label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50"
            >
              {updateProfileMutation.isPending ? "Updating..." : "Save Changes"}
            </Button>

            {/* Become Photographer Button */}
            {user?.role === "user" && (
              <div className="pt-8 border-t border-gray-100 mt-6">
                <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100/50">
                  <h3 className="text-lg font-bold text-amber-900 mb-2">Want to showcase your work?</h3>
                  <p className="text-sm text-amber-800/80 mb-4">
                    Join our community of professional photographers and start building your portfolio today.
                  </p>
                  <Link href="/photographer/onboard">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full bg-white border-amber-200 text-amber-700 hover:bg-amber-100 hover:text-amber-800 font-semibold"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Become a Photographer
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </RoleGate>
  );
}
