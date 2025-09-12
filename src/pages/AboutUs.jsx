
import React from "react";
import chefImage from "../assets/chef.jpg";
import restImage from "../assets/restaurentinterior.jpg";
import { useNavigate } from "react-router-dom";
import TriangleBackground from "../components/TriangleBackground";

function AboutUs() {
  const navigate = useNavigate();

  const handleContactUsBtn = () => {
    navigate("/contact");
  };

  return (
    <>
      {/* Section 1 */}
      <section className=" relative w-full bg-background text-text overflow-hidden py-16">
        <TriangleBackground/>
        
        <div className=" container mx-auto mb-0 flex px-5 py-3 md:flex-row flex-col items-center">
          {/* Left Text */}
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium">
              Our Story
            </h1>
            <p className="mb-8 leading-relaxed">
              Welcome to our restaurant! We believe in serving food that not only
              tastes delicious but also brings people together. Our chefs use
              fresh ingredients, traditional techniques, and a passion for flavor
              to create meals you’ll always remember.
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleContactUsBtn}
                className="ml-4 inline-flex text-gray-700 bg-amber-400 border-0 py-2 px-6 rounded hover:bg-gray-200"
              >
                Contact Us
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
            <img
              className="object-cover object-center rounded shadow-lg"
              alt="chef plating a dish"
              src={chefImage}
            />
          </div>
        </div>
        
      </section>

      {/* Section 2 */}
      <section className=" relative bg-background text-text overflow-hidden py-16">
       <TriangleBackground flipped/>
        

        <div className=" container mx-auto flex px-5 py-3  mb-0 md:flex-row flex-col-reverse items-center">
          {/* Left Image */}
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
            <img
              className="object-cover object-center rounded shadow-lg"
              alt="restaurant"
              src={restImage}
            />
          </div>

          {/* Right Text */}
          <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium">
              Our Journey
            </h1>
            <p className="mb-8 leading-relaxed">
              Founded in 2023, FoodCorner started as a small online kitchen with a
              big dream: to bring restaurant-quality meals straight to your home.
              With a passion for fresh ingredients, bold flavors, and exceptional
              service, we quickly grew into a community favorite.
              <br />
              <br />
              From our humble beginnings, we’ve focused on innovation,
              sustainability, and making every meal an experience to remember. Our
              chefs, delivery team, and staff work together to ensure every order
              is crafted with care and delivered with a smile.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default AboutUs;

