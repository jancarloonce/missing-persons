// components/CommentSection.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { listenComments, createComment } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import type { Comment } from "@/types";

interface CommentSectionProps {
  caseId: string;
}

export default function CommentSection({ caseId }: CommentSectionProps) {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();

  // comments: null = loading, [] = no comments, >0 = loaded
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  // subscribe to comments once per caseId
  useEffect(() => {
    if (!user) return;
    const unsub = listenComments(caseId, (snapshotComments) => {
      // dedupe by id just in case
      const unique = Array.from(
        new Map(snapshotComments.map((c) => [c.id, c])).values()
      );
      setComments(unique);
    });
    return unsub;
  }, [caseId, user]);

  // show loading until we have the first comments array
  if (authLoading || comments === null) {
    return <p>Loading comments…</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSubmitting(true);
    try {
      await createComment(caseId, {
        authorName: profile.username,
        content,
      });
      setContent("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Comments</h2>

      {comments.length === 0 ? (
        <p className="text-gray-500 mb-6">No comments yet.</p>
      ) : (
        <div className="space-y-4 mb-6">
          {comments.map((c) => (
            <div key={c.id} className="border p-3 rounded">
              <p className="text-sm text-gray-600">
                {c.authorName} · {formatDate(c.createdAt)}
              </p>
              <p className="mt-1">{c.content}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Add a comment…"
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
    </section>
  );
}
