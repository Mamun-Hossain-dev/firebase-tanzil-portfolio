"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/config/firebase.config";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const posts = [];
        querySnapshot.forEach((doc) => {
          posts.push({ id: doc.id, ...doc.data() });
        });
        setBlogs(posts);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              From the Blog
            </h1>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Insights, tutorials, and stories from the world of digital
              marketing.
            </p>
          </header>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold text-white">
                No Posts Yet
              </h3>
              <p className="text-gray-400 mt-2">
                Check back soon for new articles.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blogs/${blog.id}`}
                  className="block bg-white/5 rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 border border-white/10 backdrop-blur-md group"
                >
                  <div className="overflow-hidden">
                    {blog.imageUrl ? (
                      <Image
                        src={blog.imageUrl}
                        alt={blog.title}
                        width={500}
                        height={300}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
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
                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7a2 2 0 012-2h0a2 2 0 012 2v11a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h2 className="font-bold text-xl mb-2 text-white">
                      {blog.title}
                    </h2>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {blog.content
                        .replace(/^#+\s+/gm, "") // Remove markdown headings
                        .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold formatting
                        .replace(/\*(.*?)\*/g, "$1") // Remove italic formatting
                        .replace(/^\s*[\r\n]/gm, "") // Remove empty lines
                        .substring(0, 150)}
                      ...
                    </p>
                    {blog.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {blog.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-purple-600/50 text-purple-300 px-3 py-1 rounded-full text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
