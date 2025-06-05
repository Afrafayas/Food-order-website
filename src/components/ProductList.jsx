import React, { useState } from 'react';
import Products from '../data/data.json';
import ProductCard from './ProductCard';
import CategoryFilter from './CategoryFilter';


const ProductList = () => {

  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [...new Set(Products.map((product) => product.category))];

  const filteredProducts = selectedCategory ?
    Products.filter((product) => product.category === selectedCategory) : Products;
   
   


  return (
    <>

     <h2 className='text-2xl font-bold mb-4'>Products</h2>
     
    <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />


    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {filteredProducts.map((item) => (
          <ProductCard
            key={item.id}
            id={item.id}
            image={item.image}
            name={item.name}
            category={item.category}
            price={item.price}
          />
        ))}
      </div>  



     
    </>
  )
}

export default ProductList