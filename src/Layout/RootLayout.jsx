
import Navbar from "./NavBar";
import { Outlet } from "react-router-dom";

const RootLayout = ({ darkMode, setDarkMode }) => {

 

  return (
    <>
       <div className="pt-16">
  <Navbar darkMode={darkMode} setDarkMode={setDarkMode} /> 
      <main>
        <Outlet />
      </main>
      </div>
    </>
  );
};

export default RootLayout;
