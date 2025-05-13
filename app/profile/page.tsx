// app/profile/page.tsx
"use client";

import { useAuth } from "@/lib/auth";
import { useState, useEffect } from "react";
import { updateUserProfile } from "@/lib/db";
import Image from "next/image";

export default function ProfilePage() {
  const { profile, loading } = useAuth();

  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // build URLs 1–99
  const AVATAR_OPTIONS = Array.from({ length: 99 }, (_, i) =>
    `https://avatar.iran.liara.run/public/${i + 1}`
  );

  // initialize form from profile
  useEffect(() => {
    if (profile) {
      setUsername(profile.username);
      setAvatarUrl(profile.avatarUrl ?? null);
    }
  }, [profile]);

  if (loading) return <p className="p-4">Loading…</p>;
  if (!profile) return <p className="p-4">Please log in to view your profile.</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data: Partial<{ username: string; avatarUrl: string }> = { username };
      if (avatarUrl) data.avatarUrl = avatarUrl;
      await updateUserProfile(profile.uid, data);
      setStatusMessage("Profile saved successfully!");
      setTimeout(() => setStatusMessage(null), 3000);
    } catch {
      setStatusMessage("Failed to save profile.");
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      {/* Status toast */}
      {statusMessage && (
        <div className="mb-4 px-4 py-2 bg-green-100 text-green-800 border border-green-300 rounded">
          {statusMessage}
        </div>
      )}

      <h1 className="text-2xl font-semibold mb-4">My Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email (read-only) */}
        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={profile.email}
            readOnly
            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Username */}
        <div>
          <label className="block text-gray-700 mb-1">Username</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {/* Current Avatar & Change button */}
        <div>
          <label className="block text-gray-700 mb-1">Avatar</label>
          <div className="flex items-center space-x-4">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Current avatar"
                width={64}
                height={64}
                className="rounded-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded-full" />
            )}
            <button
              type="button"
              onClick={() => setShowPicker((s) => !s)}
              className="px-3 py-1 border rounded hover:bg-gray-50 transition"
            >
              {showPicker ? "Hide Avatars" : "Change Avatar"}
            </button>
          </div>
        </div>

        {/* Avatar Picker */}
        {showPicker && (
          <div className="border rounded-lg p-2 max-h-64 overflow-y-auto">
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {AVATAR_OPTIONS.map((url) => {
                const isSelected = avatarUrl === url;
                return (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setAvatarUrl(url)}
                    className={`relative w-14 h-14 rounded-full overflow-hidden focus:outline-none transition
                      ${isSelected
                        ? "ring-4 ring-blue-500 ring-offset-2"
                        : "ring-1 ring-gray-300 hover:ring-blue-300"}
                    `}
                  >
                    <Image
                      src={url}
                      alt="avatar option"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Save button */}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}
