import React from 'react';

const steps = [
  {
    icon: '📱',
    title: 'Choose Your Food',
    description: 'Browse our menu and pick your favorite dishes',
    step: '01'
  },
  {
    icon: '💳',
    title: 'Make Payment',
    description: 'Secure payment via credit/debit card',
    step: '02'
  },
  {
    icon: '👨‍🍳',
    title: 'We Prepare',
    description: 'Our chefs prepare your fresh meal',
    step: '03'
  },
  {
    icon: '🚀',
    title: 'Fast Delivery',
    description: 'Delivered to your doorstep in 30 minutes',
    step: '04'
  },
];

const HowItWorks = () => {
  return (
    <section className="w-full py-16 px-4 bg-gray-900">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            How It <span className="text-orange-500">Works</span>
          </h2>
          <p className="text-gray-400">Order your food in 4 simple steps!</p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center text-center">

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-full h-0.5 bg-orange-500/30 z-0" />
              )}

              {/* Step number */}
              <div className="relative z-10 w-20 h-20 bg-orange-500/10 border-2 border-orange-500/30 rounded-2xl flex items-center justify-center mb-4 hover:bg-orange-500 transition-all duration-300 group">
                <span className="text-3xl">{step.icon}</span>
                <span className="absolute -top-3 -right-3 bg-orange-500 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center">
                  {step.step}
                </span>
              </div>

              <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm">{step.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;