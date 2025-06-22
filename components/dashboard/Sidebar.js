import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: "📊" },
  { name: "Case Studies", href: "/dashboard/case-studies", icon: "📁" },
  { name: "Latest Works", href: "/dashboard/latest-works", icon: "🖼️" },
  { name: "Blogs", href: "/dashboard/blogs", icon: "✍️" },
  { name: "eBooks", href: "/dashboard/ebooks", icon: "📚", disabled: true },
];

export default function Sidebar({ isSidebarOpen, setSidebarOpen }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden ${
          isSidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white transform z-30 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold">Portfolio Admin</h1>
        </div>
        <nav className="mt-6 px-2">
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.disabled ? "#" : item.href}
                className={`flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${
                  pathname === item.href
                    ? "bg-purple-700 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                } ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}
