"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { motion } from "framer-motion";
import { ArrowLeft, Tag } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function CaseStudyDetailPage({ params }) {
  const actualParams = React.use(params);
  const [caseStudy, setCaseStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (actualParams.id) {
      const fetchCaseStudy = async () => {
        setLoading(true);
        setError(null);
        try {
          const docRef = doc(db, "case_studies", actualParams.id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setCaseStudy({ id: docSnap.id, ...docSnap.data() });
          } else {
            setError("Case study not found.");
          }
        } catch (err) {
          console.error("Error fetching case study:", err);
          setError("Failed to load case study. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      fetchCaseStudy();
    }
  }, [actualParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <p className="text-2xl text-red-400 mb-4">{error}</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!caseStudy) {
    return null; // Should be handled by loading/error states
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Go Back</span>
          </button>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              {caseStudy.title}
            </span>
          </h1>

          <div className="flex flex-wrap items-center gap-2 mb-8">
            <Tag className="w-5 h-5 text-gray-400" />
            {caseStudy.tags?.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm bg-gray-800 text-purple-300 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="my-8 rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/10 border border-white/10"
        >
          {caseStudy.imageUrl && (
            <Image
              src={caseStudy.imageUrl}
              alt={caseStudy.title}
              width={1200}
              height={675}
              className="w-full h-auto max-h-[450px] object-cover"
              priority
            />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed"
        >
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold text-white mb-6 mt-8 first:mt-0">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold text-white mb-4 mt-8 first:mt-0">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold text-white mb-3 mt-6 first:mt-0">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-gray-300 mb-4 leading-relaxed">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-4 space-y-2 text-gray-300">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-300">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-gray-300">{children}</li>
              ),
              strong: ({ children }) => (
                <strong className="font-bold text-white">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="italic text-gray-200">{children}</em>
              ),
            }}
          >
            {caseStudy.description}
          </ReactMarkdown>
        </motion.div>
      </div>
    </div>
  );
}
