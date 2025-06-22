"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StatCard from "@/components/dashboard/StatCard";
import AnalyticsDashboard from "@/components/dashboard/AnalyticsDashboard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase.config";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    caseStudies: 0,
    latestWorks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch users count
        const caseStudiesSnapshot = await getDocs(
          collection(db, "case_studies")
        );
        const latestWorksSnapshot = await getDocs(
          collection(db, "latest_works")
        );

        setStats({
          caseStudies: caseStudiesSnapshot.size,
          latestWorks: latestWorksSnapshot.size,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            Dashboard Overview
          </span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            title="Case Studies"
            value={stats.caseStudies}
            description="Total case studies"
            icon="📁"
          />
          <StatCard
            title="Latest Works"
            value={stats.latestWorks}
            description="Uploaded projects"
            icon="🖼️"
          />
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div>
        <h2 className="text-3xl font-bold mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            Analytics Insights
          </span>
        </h2>
        <AnalyticsDashboard />
      </div>
    </div>
  );
}
