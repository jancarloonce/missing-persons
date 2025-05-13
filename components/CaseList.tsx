"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { listenCases } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import type { Case } from "@/types";

export default function CaseList() {
  const [cases, setCases] = useState<Case[]>([]);

  useEffect(() => {
    const unsub = listenCases(setCases);
    return unsub;
  }, []);

  const uniqueCases = Array.from(
    new Map(cases.map((c) => [c.id, c])).values()
  );

  return (
    <div className="flex flex-col space-y-6 px-2">
      {uniqueCases.map((c) => (
        <CaseCard key={c.id} c={c} />
      ))}
    </div>
  );
}

function CaseCard({ c }: { c: Case }) {
  const [idx, setIdx] = useState(0);
  const photos = c.photoUrls || [];

  useEffect(() => {
    if (idx >= photos.length) setIdx(0);
  }, [photos.length, idx]);

  return (
    <Link
      href={`/cases/${c.id}`}
      className="block w-full bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
    >
      <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
        {photos.length > 0 ? (
          <Image
            src={photos[idx]}
            alt={c.title}
            fill
            style={{ objectFit: "contain" }}
            unoptimized
          />
        ) : (
          <span className="text-gray-400">No photo</span>
        )}

        {photos.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  setIdx(i);
                }}
                className={`w-2 h-2 rounded-full transition ${
                  i === idx ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800">{c.title}</h3>
        <p className="mt-1 text-sm text-gray-500">
          by {c.reporterName} · {formatDate(c.createdAt)}
        </p>
        <p className="mt-3 text-gray-700 line-clamp-3">{c.description}</p>
        <div className="mt-4 text-right">
          <span className="text-sm text-blue-600 hover:underline">
            Read more →
          </span>
        </div>
      </div>
    </Link>
  );
}
