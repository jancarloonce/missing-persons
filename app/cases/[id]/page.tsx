// app/cases/[id]/page.tsx
import React from "react";
import CommentSection from "@/components/CommentSection";
import { getCase } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import Image from "next/image";

interface CaseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CaseDetailPage({ params }: CaseDetailPageProps) {
  const { id } = await params;
  const caseData = await getCase(id);

  if (!caseData) {
    return <p className="p-4">Case not found.</p>;
  }

  return (
    <main className="p-6 space-y-6">
      {/* Only render the title, photos, and description here */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{caseData.title}</h1>
        <p className="text-sm text-gray-600">
          Posted by {caseData.reporterName} · {formatDate(caseData.createdAt)}
        </p>

        {caseData.photoUrls && caseData.photoUrls.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {caseData.photoUrls.map((url) => (
              <div key={url} className="relative w-full h-48 rounded overflow-hidden">
                <Image
                  src={url}
                  alt={caseData.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        )}

        <p className="text-gray-800">{caseData.description}</p>
      </div>

      {/* Now only the comments */}
      <CommentSection caseId={id} />
    </main>
  );
}
