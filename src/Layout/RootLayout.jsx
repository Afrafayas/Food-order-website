
import Navbar from "./NavBar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {

 

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
