import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: "LayoutDashboard" },
    { name: "Events", path: "/events", icon: "Calendar" },
    { name: "Venues", path: "/venues", icon: "Building" },
    { name: "Seat Maps", path: "/seat-maps", icon: "Grid3X3" },
    { name: "Analytics", path: "/analytics", icon: "BarChart3" },
    { name: "Scanner", path: "/scanner", icon: "QrCode" },
    { name: "Settings", path: "/settings", icon: "Settings" }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center mr-3">
            <ApperIcon name="Ticket" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">VenueFlow</h1>
            <p className="text-xs text-gray-400">Event Management</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => onClose?.()}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-surface-light"
              }`
            }
          >
            <ApperIcon name={item.icon} className="w-5 h-5 mr-3" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center p-3 rounded-lg bg-surface-light">
          <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center mr-3">
            <ApperIcon name="User" className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Demo User</p>
            <p className="text-xs text-gray-400">admin@venueflow.com</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-surface lg:border-r lg:border-gray-700 lg:h-screen lg:fixed lg:left-0 lg:top-0 lg:z-30">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-64 bg-surface border-r border-gray-700 h-full"
          >
            <SidebarContent />
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Sidebar;