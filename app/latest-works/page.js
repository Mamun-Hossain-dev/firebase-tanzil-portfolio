"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase.config";

const demoWorks = [
  {
    id: "demo1",
    title: "Modern SaaS Dashboard",
    description:
      "A modern SaaS dashboard with real-time analytics, user management, and subscription handling. Built with Next.js and Firebase.",
    imageUrl: "/images/project_placeholder.jpg",
    link: "#",
    category: "Web Development",
  },
  {
    id: "demo2",
    title: "Mobile Banking App",
    description:
      "Secure and intuitive mobile banking application with biometric authentication and real-time transaction tracking.",
    imageUrl: "/images/project_placeholder.jpg",
    link: "#",
    category: "Mobile App",
  },
  {
    id: "demo3",
    title: "AI Content Generator",
    description:
      "AI-powered content generation platform with multiple language support and SEO optimization features.",
    imageUrl: "/images/project_placeholder.jpg",
    link: "#",
    category: "AI/ML",
  },
];

export default function LatestWorksPage() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorks = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "latest_works"));
        const worksList = [];
        querySnapshot.forEach((doc) => {
          worksList.push({ id: doc.id, ...doc.data() });
        });
        setWorks(worksList.length > 0 ? worksList : demoWorks);
      } catch (error) {
        setWorks(demoWorks);
      } finally {
        setLoading(false);
      }
    };
    fetchWorks();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center mb-4 text-white">
            Latest Works
          </h1>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Explore our recent projects and see how we bring ideas to life
            through innovative solutions.
          </p>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : works.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <svg
                className="w-16 h-16 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-300">
                No Works Found
              </h3>
              <p className="text-gray-400 text-center max-w-md">
                We&apos;re currently working on adding new projects. Check back
                soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {works.map((work) => (
                <div
                  key={work.id}
                  className="bg-white/10 rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 border border-white/10 backdrop-blur-md"
                >
                  {work.imageUrl ? (
                    <Image
                      src={work.imageUrl}
                      alt={work.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="bg-gray-800 w-full h-48 flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="font-bold text-xl text-white mb-3">
                      {work.title}
                    </h2>
                    <p className="text-gray-300 text-base mb-2 whitespace-pre-line">
                      {work.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
