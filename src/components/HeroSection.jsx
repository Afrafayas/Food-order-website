import React from 'react'

const HeroSection = () => {
  return (
   <>
   <section
      className="bg-cover bg-center h-screen flex items-center justify-center text-white bg-gray-800"
      style={{ backgroundImage: "url('/images/banner.jpg')" }}
    >
      <div className="text-center bg-black bg-opacity-50 p-10 rounded-lg max-w-xl">
        <h1 className="text-5xl font-bold mb-4">Delicious Food Delivered Fast</h1>
        <p className="text-xl mb-6">Fresh, hot meals at your doorstep.</p>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-full">
          Order Now
        </button>
      </div>
    </section>
    </>
  )
}

export default HeroSection