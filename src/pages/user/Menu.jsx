

import React from 'react'
import ProductList from '../../components/ProductList'

const Menu = () => {

const getCartQuantity = (id) =>{ const itemInCart = cart.find(prod => prod?.id === id);
  return itemInCart?.quantity || 0;}

  // cart.find(prod=>prod?.id===id) || 0

  // console.log(getCartQuantity,'qqq')

  


  return (
   <> <div className=" w-full bg-background text-text">      

    <ProductList/>
     </div>
    </>
  )
}

export default Menu