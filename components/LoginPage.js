// src/app/login/page.js
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import Link from "next/link";
import { signInWithEmail } from "@/lib/firebaseRegister";
import { useRouter } from "next/navigation";
import { db } from "@/config/firebase.config";
import { doc, getDoc } from "firebase/firestore";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [firestoreError, setFirestoreError] = useState("");
  const router = useRouter();

  // Clear error messages when user starts typing
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field-specific error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Clear general error message
    if (errorMessage) setErrorMessage("");
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrorMessage("");
    setFirestoreError("");

    try {
      await signInWithEmail(formData.email, formData.password);
      router.push("/");
    } catch (error) {
      // Custom error handling for Firebase Auth
      let msg = "Login failed. Please try again.";
      if (error.code === "auth/user-not-found") {
        msg = "No account found with this email address.";
      } else if (error.code === "auth/wrong-password") {
        msg = "Incorrect password. Please try again.";
      } else if (error.code === "auth/too-many-requests") {
        msg = "Too many attempts. Account temporarily locked.";
      } else if (error.code === "auth/user-disabled") {
        msg = "This account has been disabled.";
      } else if (error.message) {
        msg = error.message;
      }
      setFirestoreError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-8 shadow-2xl relative"
        >
          {/* Error Message Banner */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -top-4 left-0 right-0 mx-4 bg-red-500/90 text-white rounded-lg py-3 px-4 flex items-start shadow-lg"
            >
              <AlertCircle className="flex-shrink-0 mt-0.5 mr-2" size={18} />
              <span className="text-sm font-medium">{errorMessage}</span>
              <button
                onClick={() => setErrorMessage("")}
                className="ml-auto text-white hover:text-gray-200"
              >
                &times;
              </button>
            </motion.div>
          )}

          {firestoreError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {firestoreError}
            </div>
          )}

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white transition-all duration-200 ${
                    errors.email ? "border-red-500/50" : "border-gray-600"
                  }`}
                />
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-400 mt-1 flex items-center">
                  <AlertCircle className="mr-1" size={14} /> {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-3 bg-gray-700/50 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white transition-all duration-200 ${
                    errors.password ? "border-red-500/50" : "border-gray-600"
                  }`}
                />
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-400 mt-1 flex items-center">
                  <AlertCircle className="mr-1" size={14} /> {errors.password}
                </p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
