import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";

import Sidebar from "../components/sidebar";
import Loading from "../components/loading";
import dummyUsers from "../data/dummydata";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
    

  // Temporary user check
  const user = dummyUsers;

  // Loading state
  if (!user) {
    return <Loading />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#FFF9EF]">

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="relative flex-1 overflow-y-auto">

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="
            absolute
            right-4
            top-4
            z-40
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-lg
            bg-white
            text-[#24202E]
            shadow-md
            transition
            hover:bg-gray-50
            sm:hidden
          "
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>

        {/* Page Content */}
        <Outlet />

      </main>

      {/* Mobile Close Button */}
      {sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="
            fixed
            right-4
            top-4
            z-50
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-lg
            bg-white
            text-[#24202E]
            shadow-md
            sm:hidden
          "
          aria-label="Close sidebar"
        >
          <X size={22} />
        </button>
      )}

    </div>
  );
};

export default Layout;