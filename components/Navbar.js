"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { User as UserIcon, LogOut } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, role, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Latest Works", href: "/latest-works" },
    { name: "Case Studies", href: "/case-studies" },
    { name: "Blog", href: "/blogs" },
  ];

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setProfileOpen(false);
  }, [pathname, user]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "py-2 bg-gradient-to-br from-gray-900 to-black/80 backdrop-blur-md"
          : "py-4 bg-black/80"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="btn btn-ghost text-lg md:text-xl">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-1 rounded-lg">
              <div className="bg-gray-900 p-2 rounded-md">
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                  Tanjil Hossain
                </h2>
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="flex items-center space-x-2 rounded-full border border-white/10 bg-white/5 p-2 backdrop-blur-sm">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative rounded-full px-4 py-2 text-sm transition-colors ${
                  pathname === item.href
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop Auth and Contact */}
        <div className="hidden md:flex items-center space-x-3">
          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg bg-white/10 px-4 py-2 font-medium text-white transition-all hover:bg-white/20"
            >
              Contact Me
            </motion.button>
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/15 focus:outline-none"
              >
                <UserIcon size={22} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white p-4 text-gray-800 shadow-lg">
                  <div className="mb-3 flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-lg font-bold">
                      {user.displayName?.[0] || user.email?.[0] || "U"}
                    </div>
                    <div>
                      <div className="font-semibold">
                        {user.displayName || user.email}
                      </div>
                      <div className="text-xs text-gray-500">{role}</div>
                    </div>
                  </div>
                  {role === "admin" && (
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        router.push("/dashboard");
                      }}
                      className="mb-2 block w-full rounded px-4 py-2 text-left text-purple-700 hover:bg-purple-100"
                    >
                      Admin Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center rounded px-4 py-2 text-left text-red-700 hover:bg-red-100"
                  >
                    <LogOut size={16} className="mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 font-medium text-white transition-all"
              >
                Login
              </motion.button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <button
            className="text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-full left-0 w-full overflow-hidden bg-gradient-to-br from-gray-900 to-black shadow-xl md:hidden"
          >
            <div className="container mx-auto px-4 py-4">
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <motion.li
                    key={item.name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block rounded-lg px-4 py-3 text-gray-300 shadow-lg transition-colors hover:bg-purple-800/40 hover:text-white hover:shadow-xl"
                    >
                      {item.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              {/* Mobile Auth Section */}
              <div className="mt-6 border-t border-white/10 pt-4">
                {user ? (
                  <div>
                    <div className="mb-3 flex items-center space-x-3 px-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-lg font-bold text-gray-800">
                        {user.displayName?.[0] || user.email?.[0] || "U"}
                      </div>
                      <div>
                        <div className="font-semibold text-white">
                          {user.displayName || user.email}
                        </div>
                        <div className="text-xs text-gray-400">{role}</div>
                      </div>
                    </div>
                    {role === "admin" && (
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          router.push("/dashboard");
                        }}
                        className="mb-2 block w-full rounded px-4 py-2 text-left text-purple-400 hover:bg-purple-800/40"
                      >
                        Admin Dashboard
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center rounded px-4 py-2 text-left text-red-400 hover:bg-red-800/40"
                    >
                      <LogOut size={16} className="mr-2" /> Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 px-4">
                    <Link
                      href="/contact"
                      className="block"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="w-full rounded-lg bg-white/10 px-4 py-2.5 font-medium text-white"
                      >
                        Contact Me
                      </motion.button>
                    </Link>
                    <Link
                      href="/login"
                      className="block"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5 font-medium text-white"
                      >
                        Login
                      </motion.button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
