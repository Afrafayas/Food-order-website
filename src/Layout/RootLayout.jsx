
import Navbar from "./NavBar";
import { Outlet } from "react-router-dom";

const RootLayout = ({ darkMode, setDarkMode }) => {

 

  return (
    <div className="min-h-screen bg-background text-text transition-colors duration-300">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
