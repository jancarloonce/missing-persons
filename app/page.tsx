// app/page.tsx
import CaseList from "@/components/CaseList";

export default function HomePage() {
  return (
    <div className="mt-6 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-2">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Recent Posts
        </h1>
        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search posts…"
            className="w-full sm:w-64 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
            Search
          </button>
        </div>
      </div>

      <CaseList />
    </div>
  );
}
