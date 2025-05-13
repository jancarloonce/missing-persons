// components/CommentSection.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { getCase, listenComments, createComment } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import type { Case, Comment } from "@/types";

export default function CommentSection({ caseId }: { caseId: string }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  const [caseData, setCaseData] = useState<Case | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // If not signed in, send them to login
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  // Fetch the case once, and subscribe to comments
  useEffect(() => {
    if (user) {
      getCase(caseId).then((c) => c && setCaseData(c));
      const unsub = listenComments(caseId, setComments);
      return unsub;
    }
  }, [caseId, user]);

  if (loading || !caseData) return <p>Loading…</p>;

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSubmitting(true);
    await createComment(caseId, {
      authorName: profile.username,
      content,
    });
    setContent("");
    setSubmitting(false);
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-2">{caseData.title}</h1>
      <p className="mb-4 text-sm text-gray-600">
        Posted by {caseData.reporterName} ·{" "}
        {formatDate(caseData.createdAt)}
      </p>
      <p className="mb-6">{caseData.description}</p>

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-4">Comments</h2>
      <div className="space-y-4 mb-6">
        {comments.map((c) => (
          <div key={c.id} className="border p-2 rounded">
            <p className="text-sm text-gray-600">
              {c.authorName} ‒ {formatDate(c.createdAt)}
            </p>
            <p>{c.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleComment} className="max-w-lg space-y-4">
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Write a comment…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {submitting ? "Posting…" : "Post Comment"}
        </button>
      </form>
    </>
  );
}
