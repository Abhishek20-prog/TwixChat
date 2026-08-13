import React, { useState } from "react";
import { Menu } from "lucide-react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/sidebar";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#FFF9EF]">

      {/* ================= SIDEBAR ================= */}

      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* ================= MAIN CONTENT ================= */}

      <main className="relative flex-1 overflow-y-auto">

        {/* Mobile Menu Button */}

        {!sidebarOpen && (
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="
              fixed
              right-4
              top-4
              z-30
              rounded-xl
              bg-white
              p-2.5
              text-[#24202E]
              shadow-md
              transition
              hover:shadow-lg
              sm:hidden
            "
          >
            <Menu size={21} />
          </button>
        )}

        {/* Current Page */}

        <Outlet />

      </main>

    </div>
  );
};

export default Layout;