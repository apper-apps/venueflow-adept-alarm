import React, { useState } from "react";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";

const Layout = ({ children, title, subtitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 lg:ml-64">
        <Header 
          onMenuClick={() => setSidebarOpen(true)} 
          title={title}
          subtitle={subtitle}
        />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;