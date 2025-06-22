"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import BlogForm from "@/components/dashboard/BlogForm";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, storage } from "@/config/firebase.config";
import { ref, deleteObject } from "firebase/storage";
import { Trash2, Pencil } from "lucide-react";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, "blogs"));
      const posts = [];
      querySnapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() });
      });
      setBlogs(posts);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError("Failed to load blog posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blog) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      try {
        if (blog.imageUrl && !blog.imageUrl.includes("cloudinary.com")) {
          const imageRef = ref(storage, blog.imageUrl);
          await deleteObject(imageRef);
        }
        await deleteDoc(doc(db, "blogs", blog.id));
        fetchBlogs();
      } catch (error) {
        if (error.code === "storage/object-not-found") {
          console.warn("Image not found in storage, deleting document anyway.");
          await deleteDoc(doc(db, "blogs", blog.id));
          fetchBlogs();
        } else {
          console.error("Error deleting blog post:", error);
        }
      }
    }
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedBlog(null);
  };

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Blogs</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Add New Post
        </motion.button>
      </div>

      {showForm && (
        <BlogForm
          blog={selectedBlog}
          onClose={handleFormClose}
          onSuccess={fetchBlogs}
        />
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-400 bg-red-900/20 rounded-lg">
          {error}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700/50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {blogs.map((blog) => (
                <tr key={blog.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/blogs/${blog.id}`}
                      className="text-sm font-medium text-gray-100 hover:text-purple-400 transition-colors"
                    >
                      {blog.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(blog)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(blog)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {blogs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No blog posts found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
