import React from 'react';
import chefImage from '../assets/chef.jpg';
import restImage from '../assets/restaurentinterior.jpg';
import { useNavigate } from 'react-router-dom';

function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className="w-full font-sans">

      {/* Hero */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 py-20 px-4 text-center">
        <p className="text-orange-500 font-semibold mb-2">Who We Are</p>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
          About <span className="text-orange-500">BiteCraft</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Delivering happiness, one meal at a time 🍔
        </p>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <p className="text-orange-500 font-semibold mb-2">🍽️ Our Story</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
              Passionate About Food
            </h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              Welcome to BiteCraft! We believe in serving food that not only
              tastes delicious but also brings people together. Our chefs use
              fresh ingredients, traditional techniques, and a passion for flavor
              to create meals you'll always remember.
            </p>
            <button
              onClick={() => navigate('/contact')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition"
            >
              Contact Us →
            </button>
          </div>
          <div className="md:w-1/2">
            <img
              src={chefImage}
              alt="Chef"
              className="w-full rounded-3xl shadow-2xl object-cover h-80"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 bg-orange-500">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: '50+', label: 'Menu Items' },
            { number: '1000+', label: 'Happy Customers' },
            { number: '30 min', label: 'Avg Delivery' },
            { number: '4.8⭐', label: 'Rating' },
          ].map((stat, index) => (
            <div key={index}>
              <p className="text-4xl font-extrabold text-white">{stat.number}</p>
              <p className="text-orange-100 font-medium mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center gap-12">
          <div className="md:w-1/2">
            <p className="text-orange-500 font-semibold mb-2">📖 Our Journey</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
              From Small Kitchen to Big Dreams
            </h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              Founded in 2023, BiteCraft started as a small online kitchen with a
              big dream: to bring restaurant-quality meals straight to your home.
              With a passion for fresh ingredients, bold flavors, and exceptional
              service, we quickly grew into a community favorite.
            </p>
            <p className="text-gray-500 leading-relaxed">
              From our humble beginnings, we've focused on innovation,
              sustainability, and making every meal an experience to remember.
              Our chefs, delivery team, and staff work together to ensure every
              order is crafted with care and delivered with a smile.
            </p>
          </div>
          <div className="md:w-1/2">
            <img
              src={restImage}
              alt="Restaurant"
              className="w-full rounded-3xl shadow-2xl object-cover h-80"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <p className="text-orange-500 font-semibold mb-2">💡 Our Values</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            What We Stand For
          </h2>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: '🌿', title: 'Fresh Ingredients', desc: 'We use only the freshest, locally-sourced ingredients in every dish.' },
            { icon: '⚡', title: 'Fast Delivery', desc: 'Hot meals delivered to your door in 30 minutes or less.' },
            { icon: '❤️', title: 'Made with Love', desc: 'Every dish is prepared with passion and care by our expert chefs.' },
          ].map((value, index) => (
            <div key={index} className="bg-gray-800 rounded-2xl p-6 text-center hover:bg-gray-700 transition">
              <span className="text-5xl mb-4 block">{value.icon}</span>
              <h3 className="text-white font-bold text-xl mb-2">{value.title}</h3>
              <p className="text-gray-400 text-sm">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default AboutUs;