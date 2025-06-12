import React from 'react'
import menuData from '../data/data.json';

const FeaturedItems = () => {
  const featuredItems = menuData.filter(item => item.featured);

  return (
    <>
      <section className="py-10 px-4 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold mb-6">Best Sellers</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {featuredItems?.map(item => (
            <div key={item?.id} className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition-shadow duration-300">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="rounded-md mb-2 w-full h-40 object-cover"
                />
              )}
              <h3 className="text-xl font-semibold">{item.name}</h3>
              <p className="text-yellow-600 font-bold">${item.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default FeaturedItems;
