  import React from 'react';
  import dummyImage from '../assets/no-image.jpg';


  const ProductCard = ({ id, image, name, category, price }) => {
    return (
      <div className='border p-4 rounded-lg bg-white hover:shadow-md transition text-center h-full flex flex-row md:flex-col'>
      
        <div className='w-full h-48 overflow-hidden'>
          {(image&&(<img src={image}
          alt={name} 
          onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = dummyImage;
                  
                }} 
          className='object-cover w-full h-full rounded' />))

          ||

          (<img src={dummyImage} 
            alt="No product available" 
            className="object-cover w-full h-full rounded" />)
          
          }
    
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
