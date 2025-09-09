import { NavLink, Outlet } from "react-router-dom";
import NavBar from "./NavBar";

const AdminLayout = () => {
  return (
    <div className="flex  bg-gray-50 min-h-screen">



    

        
    
      

      {/* Main Content */}
      <main className="w-full p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
