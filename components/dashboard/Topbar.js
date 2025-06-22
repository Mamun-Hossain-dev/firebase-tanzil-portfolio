import { motion } from "framer-motion";
import { Menu } from "lucide-react";

export default function Topbar({ user, toggleSidebar }) {
  return (
    <header className="bg-gray-800 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <button
          onClick={toggleSidebar}
          className="text-gray-300 hover:text-white md:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex-1"></div> {/* Spacer */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-100">
              {user?.displayName || user?.email}
            </p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>

          <div className="relative">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {}}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Logout
          </motion.button>
        </div>
      </div>
    </header>
  );
}
