import React from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

function ContactUs() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    reset();
  };

  return (
    <div className="w-full font-sans">

      {/* Hero */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 py-20 px-4 text-center">
        <p className="text-orange-500 font-semibold mb-2">Get In Touch</p>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
          Contact <span className="text-orange-500">Us</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          We'd love to hear from you! Send us a message 💬
        </p>
      </section>

      {/* Content */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Left — Info */}
          <div>
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
              Let's Talk! 👋
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Have a question about your order, feedback, or just want to say hello?
              We're here to help!
            </p>

            {/* Contact Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Mail className="text-orange-500" size={22} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-gray-800 font-semibold">bitecraft@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Phone className="text-orange-500" size={22} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="text-gray-800 font-semibold">+971 50 123 4567</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <MapPin className="text-orange-500" size={22} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Address</p>
                  <p className="text-gray-800 font-semibold">Khalifa City, Abu Dhabi, UAE</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-10">
              <p className="text-gray-500 text-sm mb-4">Follow us on:</p>
              <div className="flex gap-4">
                {[
                  { name: 'Facebook', color: 'hover:bg-blue-600', icon: '📘' },
                  { name: 'Instagram', color: 'hover:bg-pink-500', icon: '📸' },
                  { name: 'Twitter', color: 'hover:bg-sky-500', icon: '🐦' },
                  { name: 'WhatsApp', color: 'hover:bg-green-500', icon: '💬' },
                ].map((social) => (
                  <button
                    key={social.name}
                    className={`w-12 h-12 bg-gray-200 ${social.color} rounded-xl flex items-center justify-center text-xl transition`}
                  >
                    {social.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Send a Message</h3>

            {isSubmitSuccessful && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-6 text-center">
                ✅ Thank you! We've received your message!
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-1 block">Full Name</label>
                  <input
                    {...register('fullName', { required: 'Name is required' })}
                    placeholder="Afra NK"
                    className={`w-full border-2 rounded-xl px-4 py-3 focus:outline-none ${
                      errors.fullName ? 'border-red-400' : 'border-gray-200 focus:border-orange-400'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-1 block">Email</label>
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                    })}
                    type="email"
                    placeholder="you@example.com"
                    className={`w-full border-2 rounded-xl px-4 py-3 focus:outline-none ${
                      errors.email ? 'border-red-400' : 'border-gray-200 focus:border-orange-400'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">Subject</label>
                <input
                  {...register('subject')}
                  placeholder="How can we help?"
                  className="w-full border-2 border-gray-200 focus:border-orange-400 rounded-xl px-4 py-3 focus:outline-none"
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">Message</label>
                <textarea
                  {...register('message', { required: 'Message is required' })}
                  rows="5"
                  placeholder="Write your message here..."
                  className={`w-full border-2 rounded-xl px-4 py-3 focus:outline-none resize-none ${
                    errors.message ? 'border-red-400' : 'border-gray-200 focus:border-orange-400'
                  }`}
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition"
              >
                <Send size={18} />
                Send Message
              </button>
            </form>
          </div>

        </div>
      </section>

    </div>
  );
}

export default ContactUs;