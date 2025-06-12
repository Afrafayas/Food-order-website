import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <Link to="/">Home</Link> | 
      <Link to="/menu">Menu</Link> | 
      <Link to="/cart">Cart</Link> | 
      <Link to="/about">About</Link> | 
      <Link to="/contact">Contact</Link>|
      <Link to="/login">Login</Link>

      
    </nav>
  );
};

export default Navbar;
