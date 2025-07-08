"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import {
  doc,
  setDoc,
  collection,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { useAuth } from "@/AuthContext";

// Helper function to generate a unique ID
const generateUniqueId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomStr}`;
};

export default function BlogForm({ blog, onClose, onSuccess }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
    imageFile: null,
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || "",
        content: blog.content || "",
        tags: blog.tags ? blog.tags.join(", ") : "",
        imageUrl: blog.imageUrl || "",
        imageFile: null,
      });
    }
  }, [blog]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsCompressing(true);
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      const cloudFormData = new FormData();
      cloudFormData.append("file", compressedFile);
      cloudFormData.append("upload_preset", "unsigned_preset");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dlcpaiziv/image/upload",
        {
          method: "POST",
          body: cloudFormData,
        }
      );
      const data = await res.json();
      if (!data.secure_url) throw new Error("Cloudinary upload failed");
      setFormData((prev) => ({
        ...prev,
        imageFile: null,
        imageUrl: data.secure_url,
      }));
    } catch (error) {
      console.error("Image upload error:", error);
      setError("Failed to upload image. Please try a different file.");
      setFormData((prev) => ({ ...prev, imageFile: null }));
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!user) {
      setError("You must be logged in to create a post.");
      setLoading(false);
      return;
    }

    try {
      const blogData = {
        title: formData.title,
        content: formData.content,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        imageUrl: formData.imageUrl,
        createdAt: Timestamp.now(),
        author: {
          name: user.displayName || user.email,
          uid: user.uid,
        },
      };

      if (blog) {
        await setDoc(doc(db, "blogs", blog.id), blogData, {
          merge: true,
        });
      } else {
        const uniqueId = generateUniqueId();
        await setDoc(doc(db, "blogs", uniqueId), blogData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving blog:", error);
      setError("Failed to save blog post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!blog) return;
    if (confirm("Are you sure you want to delete this blog post?")) {
      try {
        await deleteDoc(doc(db, "blogs", blog.id));
        onSuccess();
        onClose();
      } catch (error) {
        setError("Failed to delete blog post. Please try again.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto pt-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-lg md:max-w-2xl lg:max-w-4xl text-white"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            {blog ? "Edit Blog Post" : "Add New Blog Post"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            &times;
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 text-red-300 rounded-lg border border-red-500/50">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Content
            </label>
            <div className="mb-2 text-xs text-gray-400">
              <p className="mb-1">Formatting Guide:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Use <strong>## Heading</strong> for main headings
                </li>
                <li>
                  Use <strong>### Subheading</strong> for subheadings
                </li>
                <li>
                  Use <strong>**bold text**</strong> for emphasis
                </li>
                <li>
                  Use <strong>*italic text*</strong> for italics
                </li>
                <li>Add blank lines between paragraphs for proper spacing</li>
              </ul>
            </div>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={15}
              placeholder="## Introduction

This is a sample blog post with proper formatting.

### Key Points

- First point
- Second point
- Third point

### Conclusion

This is the conclusion paragraph with proper spacing."
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white font-mono text-sm"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Featured Image
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-purple-300 hover:file:bg-gray-600"
              />
            </div>
            {formData.imageUrl && !formData.imageFile && (
              <div className="mt-2">
                <Image
                  src={formData.imageUrl}
                  alt="Preview"
                  width={320}
                  height={240}
                  style={{ width: 320, height: "auto" }}
                  className="max-w-xs h-auto rounded-lg"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            {blog && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                disabled={loading}
              >
                Delete
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              disabled={loading}
            >
              {blog ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
