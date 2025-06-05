import React from 'react';

const ProductCard = ({ id, image, name, category, price }) => {
  return (
    <div className='border p-4 rounded-lg bg-white hover:shadow-md transition text-center h-full flex flex-row md:flex-col'>
     
      <div className='w-1/3 md:w-full h-48 overflow-hidden'> 
        <img src={image} alt={name} className='object-contain w-full h-full rounded' />
      </div> 

    
      <div className='flex flex-col flex-1 justify-between p-4 w-full md:w-full'>
        <h2 className="mt-4 text-md font-semibold">{name}</h2>
        <h4 className='text-gray-500'>{category}</h4>   
        <p className="text-blue-600 font-bold mb-4">${price}</p> 

        
        
      </div>
    </div>
  );
};

export default ProductCard;
