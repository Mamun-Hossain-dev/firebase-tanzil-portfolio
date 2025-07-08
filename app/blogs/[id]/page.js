"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import ReactMarkdown from "react-markdown";
import { ArrowLeft } from "lucide-react";

export default function BlogPostPage() {
  const router = useRouter();
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        setLoading(true);
        try {
          const docRef = doc(db, "blogs", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setBlog({ id: docSnap.id, ...docSnap.data() });
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching blog post:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchBlog();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Post not found</h1>
            <p>This blog post may have been removed or does not exist.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-24 text-white">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="group mb-8 inline-flex items-center text-gray-300 transition-colors duration-200 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to posts</span>
          </button>
          <article>
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
                {blog.title}
              </h1>
              <div className="flex items-center text-gray-400 text-sm space-x-4">
                <p>
                  Published on{" "}
                  {new Date(blog.createdAt?.toDate()).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
                {blog.author?.name && (
                  <>
                    <span>&bull;</span>
                    <p>By Tanjil Hossain</p>
                  </>
                )}
              </div>
            </header>

            {blog.imageUrl && (
              <div className="mb-8 overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src={blog.imageUrl}
                  alt={blog.title}
                  width={1200}
                  height={600}
                  className="w-full max-h-[450px] object-cover"
                />
              </div>
            )}

            <div className="prose prose-invert prose-lg max-w-none text-slate-300 font-normal leading-relaxed text-justify">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold text-slate-300 mb-6 mt-8 first:mt-0">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-bold text-slate-300 mb-4 mt-8 first:mt-0">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-semibold text-slate-300 mb-3 mt-6 first:mt-0">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-slate-300 font-normal mb-4 leading-relaxed text-justify">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-4 space-y-2 text-slate-300 font-normal">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-4 space-y-2 text-slate-300 font-normal">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-slate-300 font-normal">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold text-slate-300">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-slate-300">{children}</em>
                  ),
                }}
              >
                {blog.content}
              </ReactMarkdown>
            </div>

            {blog.tags?.length > 0 && (
              <footer className="mt-12 pt-8 border-t border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-purple-600/50 text-purple-300 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </footer>
            )}
          </article>
        </div>
      </div>
    </>
  );
}
