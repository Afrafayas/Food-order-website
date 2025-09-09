



import React from 'react';
import { useForm } from 'react-hook-form';
import { BiMailSend } from 'react-icons/bi';

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
    <div className="bg-background min-h-screen py-10 px-4 text-text transition-colors duration-300">
  <section className="max-w-xl p-6  container px-5 py-24 mx-auto  ">
    <h2 className="text-3xl font-bold text-center mb-6">Contact Us</h2>


        {isSubmitSuccessful && (
          <div className="bg-green-100 text-green-800 p-3 rounded mb-5 text-center">
            Thank you — we’ve received your message!
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 ">
          {/* Name + Email row */}
          <div className="flex flex-col md:flex-row md:space-x-4">
            {/* Name */}
            <div className="w-full md:w-1/2">
              <label className="block font-medium text-text">Full Name</label>
              <input
                {...register('fullName', { required: 'Name is required' })}
                className={`mt-1 w-full p-3 border rounded ${
                  errors.fullName ? 'border-red-500' : 'border-orange-400'
                }`}
                placeholder="Your name"
              />
              {errors.fullName && (
                <p className="mt-1 text-red-500 text-sm">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="w-full md:w-1/2 mt-4 md:mt-0">
              <label className="block font-medium text-text">Email</label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
                })}
                type="email"
                className={`mt-1 w-full p-3 border rounded ${
                  errors.email ? 'border-red-500' : 'border-orange-400'
                }`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block font-medium text-text">Subject</label>
            <input
              {...register('subject')}
              className="mt-1 w-full p-3 border border-amber-200 rounded"
              placeholder="Subject (optional)"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block font-medium text-text ">Message</label>
            <textarea
              {...register('message', { required: 'Please write a message' })}
              rows="5"
              className={`mt-1 w-full p-3 border rounded resize-y ${
                errors.message ? 'border-red-500' : 'border-amber-400'
              }`}
              placeholder="How can we help?"
            />
            {errors.message && (
              <p className="mt-1 text-red-500 text-sm">{errors.message.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded transition"
          >
            Send Message <BiMailSend className="ml-2" />
          </button>
        </form>
      </section>
      <div className="p-2 w-full pt-8 mt-8 border-t border-gray-200 text-center">
  <a href="mailto:example@email.com" className="text-indigo-500 hover:underline">
    foodcorner@email.com
  </a>
  <p className="leading-normal my-5">
    49 Smith St.
    <br />
    Saint Cloud, MN 56301
  </p>
  <span className="inline-flex">
    {/* Facebook */}
    <a
      href="https://facebook.com/yourpage"
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-500 hover:text-indigo-500"
    >
      <svg
        fill="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="w-5 h-5"
        viewBox="0 0 24 24"
      >
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
      </svg>
    </a>

    {/* Twitter */}
    <a
      href="https://twitter.com/yourprofile"
      target="_blank"
      rel="noopener noreferrer"
      className="ml-4 text-gray-500 hover:text-sky-500"
    >
      <svg
        fill="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="w-5 h-5"
        viewBox="0 0 24 24"
      >
        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
      </svg>
    </a>

    {/* Instagram */}
    <a
      href="https://instagram.com/yourprofile"
      target="_blank"
      rel="noopener noreferrer"
      className="ml-4 text-gray-500 hover:text-pink-500"
    >
      <svg
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="w-5 h-5"
        viewBox="0 0 24 24"
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
      </svg>
    </a>

    {/* WhatsApp */}
    <a
      href="https://wa.me/1234567890"
      target="_blank"
      rel="noopener noreferrer"
      className="ml-4 text-gray-500 hover:text-green-500"
    >
      <svg
        fill="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="w-5 h-5"
        viewBox="0 0 24 24"
      >
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
      </svg>
    </a>
  </span>
</div>

    </div>
  );
}

export default ContactUs;
