"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../../AuthContext";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import { useEffect, useState } from "react";
import Script from "next/script";

export default function DashboardLayout({ children }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || role !== "admin")) {
      router.push("/login");
    }
  }, [user, role, loading, router]);

  if (loading || !user || role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <>
      {typeof window !== "undefined" &&
        process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
        )}
      {typeof window !== "undefined" &&
        process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <Script id="gtag-init" strategy="afterInteractive">
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
          `}
          </Script>
        )}
      <div className="flex h-screen bg-gray-900 text-gray-100">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Topbar
            user={user}
            toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
          />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-900">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
