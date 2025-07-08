"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import WorkForm from "@/components/dashboard/WorkForm";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, storage } from "@/config/firebase.config";
import { ref, deleteObject } from "firebase/storage";
import { Trash2, Pencil } from "lucide-react";

export default function LatestWorksPage() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWork, setSelectedWork] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, "latest_works"));
      const worksList = [];
      querySnapshot.forEach((doc) => {
        worksList.push({ id: doc.id, ...doc.data() });
      });
      setWorks(worksList);
    } catch (error) {
      console.error("Error fetching latest works:", error);
      setError("Failed to load latest works. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (work) => {
    if (confirm("Are you sure you want to delete this work?")) {
      try {
        if (work.imageUrl && !work.imageUrl.includes("cloudinary.com")) {
          const imageRef = ref(storage, work.imageUrl);
          await deleteObject(imageRef);
        }
        await deleteDoc(doc(db, "latest_works", work.id));
        fetchWorks();
      } catch (error) {
        if (error.code === "storage/object-not-found") {
          console.warn("Image not found, deleting document anyway");
          await deleteDoc(doc(db, "latest_works", work.id));
          fetchWorks();
        } else {
          console.error("Error deleting work:", error);
        }
      }
    }
  };

  const handleEdit = (work) => {
    setSelectedWork(work);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedWork(null);
  };

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Latest Works</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Add New Work
        </motion.button>
      </div>

      {showForm && (
        <WorkForm
          work={selectedWork}
          onClose={handleFormClose}
          onSuccess={fetchWorks}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {works.map((work) => (
            <div
              key={work.id}
              className="bg-gray-800 rounded-xl shadow-sm overflow-hidden"
            >
              {work.imageUrl ? (
                <Image
                  src={work.imageUrl}
                  alt={work.title}
                  width={400}
                  height={192}
                  style={{ width: 400, height: "auto" }}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="bg-gray-700 border-2 border-dashed border-gray-600 w-full h-48" />
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{work.title}</h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {work.description}
                </p>
                <div className="flex justify-end items-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(work)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(work)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && works.length === 0 && (
        <div className="text-center py-8 text-gray-500">No works found</div>
      )}
    </div>
  );
}
