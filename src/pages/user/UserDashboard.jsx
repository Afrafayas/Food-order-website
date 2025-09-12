// import React, { useEffect } from 'react';
import HeroSection from '../../components/HeroSection';
import FeaturedItems from '../../components/FeaturedItems';
import { useDispatch, useSelector } from 'react-redux';
// import { Hand } from 'lucide-react';
// import { addToCart } from '../../redux/cartSlice';
// import toast from 'react-hot-toast';
// import { BsCartCheckFill   } from "react-icons/bs";

const UserDashboard = () => {
  const dispatch =useDispatch()
  // const products = useSelector(state=>state.products)
  //  const cart = useSelector(state=>state.cart)
  // console.log(products,'dfcgh')

  
  return (
    <>

     <div className=" w-full bg-background p-8">
     
    <HeroSection/>
    <FeaturedItems/>

    



     </div>
 

    </>
   
  );
};

export default UserDashboard;
