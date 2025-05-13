"use client";

import { useState, useEffect, ClipboardEvent, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/auth";
import { createCase } from "@/lib/db";
import { uploadCasePhoto } from "@/lib/storage";
import type { NewCase } from "@/types";

export default function NewCasePage() {
  const { profile, loading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !profile) {
      router.push("/login");
    }
  }, [loading, profile, router]);

  const handlePaste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    const imageItems = Array.from(e.clipboardData.items).filter((i) =>
      i.type.startsWith("image/")
    );
    if (imageItems.length) {
      e.preventDefault();
      imageItems.forEach((item) => {
        const file = item.getAsFile();
        if (file && files.length < 5) {
          setFiles((prev) => [...prev, file]);
        }
      });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const picked = Array.from(e.target.files).slice(0, 5 - files.length);
      setFiles((prev) => [...prev, ...picked]);
    }
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;

    setSubmitting(true);
    setError(null);

    try {
      // 1) upload images first
      const photoUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        setProgress(`Uploading ${i + 1} of ${files.length}…`);
        const url = await uploadCasePhoto(profile.uid, files[i]);
        photoUrls.push(url);
      }

      // 2) create case
      setProgress("Saving case…");
      const docRef = await createCase({
        title,
        description,
        reporterId: profile.uid,
        reporterName: profile.username,
        photoUrls,
      } as NewCase & { photoUrls: string[] });

      router.push(`/cases/${docRef.id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to post case. Please try again.");
      setSubmitting(false);
      setProgress(null);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Post a Missing Person</h2>
      {error && (
        <div className="mb-4 px-4 py-2 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}
      {progress && (
        <div className="mb-4 px-4 py-2 bg-blue-100 text-blue-800 rounded">
          {progress}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-1">Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="e.g. John Doe – Last seen in QC"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={submitting}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Description</label>
          <textarea
            className="w-full p-2 border rounded"
            placeholder="Details…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onPaste={handlePaste}
            rows={4}
            required
            disabled={submitting}
          />
          <p className="mt-1 text-sm text-gray-500">
            You can paste images directly here (up to 5 total).
          </p>
        </div>

        {files.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {files.map((file, idx) => {
              const url = URL.createObjectURL(file);
              return (
                <div key={idx} className="relative">
                  <Image
                    src={url}
                    alt="preview"
                    width={200}
                    height={120}
                    className="object-cover rounded"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="absolute top-1 right-1 bg-gray-800 bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div>
          <label className="block text-gray-700 mb-1">Upload Photos</label>
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={files.length >= 5 || submitting}
            onChange={handleFileChange}
            className="w-full"
          />
          <p className="mt-1 text-sm text-gray-500">
            {files.length}/5 uploaded
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {submitting ? "Posting…" : "Submit"}
        </button>
      </form>
    </div>
  );
}
