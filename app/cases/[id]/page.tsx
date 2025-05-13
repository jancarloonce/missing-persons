// app/cases/[id]/page.tsx

import React from "react";
import CommentSection from "@/components/CommentSection";
import { getCase } from "@/lib/db";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

interface CaseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CaseDetailPage({ params }: CaseDetailPageProps) {
  // await the params before destructuring
  const { id } = await params;

  // fetch the case data
  const caseData = await getCase(id);
  if (!caseData) {
    return <p className="p-4">Case not found.</p>;
  }

  return (
    <main className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">{caseData.title}</h1>
      <p className="text-sm text-gray-600">
        Posted by {caseData.reporterName} · {formatDate(caseData.createdAt)}
      </p>

      {/* Photo gallery, if any */}
      {caseData.photoUrls && caseData.photoUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {caseData.photoUrls.map((url) => (
            <div key={url} className="relative w-full h-48 rounded overflow-hidden">
              <Image
                src={url}
                alt="Case photo"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ))}
        </div>
      )}

      <p className="text-gray-800">{caseData.description}</p>

      <hr className="my-6" />

      {/* Comments & comment form */}
      <CommentSection caseId={id} />
    </main>
  );
}
