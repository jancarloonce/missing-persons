// app/layout.tsx
import "@/styles/globals.css";
import { AuthProvider } from "@/lib/auth";
import Header from "@/components/Header";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <AuthProvider>
          <Header />
          <main className="max-w-4xl mx-auto px-4 py-6">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
