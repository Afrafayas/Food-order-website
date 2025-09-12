
import Navbar from "./NavBar";
import { Outlet } from "react-router-dom";

const RootLayout = ({ darkMode, setDarkMode }) => {

 

  return (
    <>
       <Navbar darkMode={darkMode} setDarkMode={setDarkMode} /> 
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
