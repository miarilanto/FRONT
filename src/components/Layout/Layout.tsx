import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex min-h-screen">

        <Sidebar />

        <div className="flex flex-1 flex-col">

          <Navbar />

          <main className="flex-1 p-8">
            <Outlet />
          </main>

        </div>

      </div>
    </div>
  );
}

export default Layout;