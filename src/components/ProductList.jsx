import React, { useState } from 'react';
import Products from '../data/data.json';
import ProductCard from './Productcard';
import CategoryFilter from './CategoryFilter';
import SearchBar from './SearchBar'; 

const ProductList = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [...new Set(Products?.map((product) => product.category))];

  
  const filteredProducts = Products?.filter((product) => {
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <h2 className='text-2xl font-bold mb-4'>Products</h2>

     <div className=' '>
      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      </div> 

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {filteredProducts?.map((item) => (
          <ProductCard
            key={item?.id}
            id={item.id}
            image={item?.image}
            name={item.name}
            category={item.category}
            price={item.price}
          />
        ))}
      </div>
    </>
  );
};

export default ProductList;
