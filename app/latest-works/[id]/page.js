"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { ArrowLeft } from "lucide-react";

const demoWorks = [
  {
    id: "demo1",
    title: "Modern SaaS Dashboard",
    description:
      "A modern SaaS dashboard with real-time analytics, user management, and subscription handling. Built with Next.js and Firebase.",
    imageUrl: "/images/project_placeholder.jpg",
  },
  {
    id: "demo2",
    title: "Mobile Banking App",
    description:
      "Secure and intuitive mobile banking application with biometric authentication and real-time transaction tracking.",
    imageUrl: "/images/project_placeholder.jpg",
  },
  {
    id: "demo3",
    title: "AI Content Generator",
    description:
      "AI-powered content generation platform with multiple language support and SEO optimization features.",
    imageUrl: "/images/project_placeholder.jpg",
  },
];

export default function LatestWorkDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchWork = async () => {
        setLoading(true);
        try {
          const docRef = doc(db, "latest_works", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setWork({ id: docSnap.id, ...docSnap.data() });
          } else {
            // fallback to demoWorks
            const demo = demoWorks.find((w) => w.id === id);
            setWork(demo || null);
          }
        } catch (error) {
          const demo = demoWorks.find((w) => w.id === id);
          setWork(demo || null);
        } finally {
          setLoading(false);
        }
      };
      fetchWork();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (!work) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Work not found</h1>
            <p>This work may have been removed or does not exist.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-24 text-white">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.push("/latest-works")}
            className="group mb-8 inline-flex items-center text-gray-300 transition-colors duration-200 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to works</span>
          </button>
          <article>
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
                {work.title}
              </h1>
            </header>
            {work.imageUrl && (
              <div className="mb-8 overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src={work.imageUrl}
                  alt={work.title}
                  width={1200}
                  height={600}
                  className="w-full max-h-[450px] object-cover"
                />
              </div>
            )}
            <div className="prose prose-invert prose-lg max-w-none text-white font-medium leading-relaxed">
              <p className="text-white font-medium mb-4 leading-relaxed whitespace-pre-line">
                {work.description}
              </p>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
