import React from "react";
import {
  HiChevronRight,
  HiPhone,
  HiMail,
  HiLocationMarker,
  HiClock,
} from "react-icons/hi";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

function Contact() {
  return (
    <div className="bg-gray-50">
      {/* ================= Banner Section ================= */}
      <div
        className="min-h-[300px] bg-cover bg-center bg-no-repeat relative mx-6 rounded-xl overflow-hidden"
        style={{
          backgroundImage: "url('/images/aboutBanner.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 p-10 flex flex-col justify-center h-full">

          <nav
            className="flex items-center text-sm font-medium text-white"
            aria-label="Breadcrumb"
          >
            <ol className="flex items-center space-x-2">
              <li>
                <a
                  href="/"
                  className="hover:text-orange-400 transition-colors duration-200"
                >
                  Home
                </a>
              </li>
              <li>
                <HiChevronRight className="h-4 w-4 text-gray-300" />
              </li>
              <li className="text-orange-400 font-semibold">Contact</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ================= Contact Cards ================= */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <p className="text-primary text-center font-bold">Get in touch</p>
        <h1 className="text-4xl md:text-5xl font-bold text-fourth mb-4 text-center">
            Start Your Journey With Us
          </h1>
        <div className="grid md:grid-cols-2 gap-8">

          {/* Phone & Email */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100">
            <div className="flex items-start gap-5">
              <div className="bg-orange-100 p-4 rounded-lg text-orange-500 text-2xl">
                <HiPhone />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Reach Us</h3>
                <p className="text-gray-600 mb-1">
                  Phone: <span className="font-medium">+1-647-362-7735</span>
                </p>
                <p className="text-gray-600">
                  Email:{" "}
                  <span className="font-medium">
                    support@cargologisticscompany.com
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100">
            <div className="flex items-start gap-5">
              <div className="bg-orange-100 p-4 rounded-lg text-orange-500 text-2xl">
                <HiClock />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Office Hours</h3>
                <p className="text-gray-600">
                  Mon - Sat: 07:00 AM - 10:00 PM
                </p>
                <p className="text-gray-600">Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100">
            <div className="flex items-start gap-5">
              <div className="bg-orange-100 p-4 rounded-lg text-orange-500 text-2xl">
                <HiLocationMarker />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Location</h3>
                <p className="text-gray-600">
                  8825 Stanford Blvd Suite 306 <br />
                  Columbia MD 21045 USA
                </p>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100">
            <div className="flex items-start gap-5">
              <div className="bg-orange-100 p-4 rounded-lg text-orange-500 text-2xl">
                <HiMail />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Customer Support</h3>
                <p className="text-gray-600">
                  Find quick answers in our FAQ section or contact our support
                  team anytime.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* ================= Social Section ================= */}
        <div className="mt-16 text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-6">
            Social Connect
          </h3>

          <div className="flex justify-center gap-6">
            {[FaFacebookF, FaXTwitter, FaInstagram, FaYoutube].map(
              (Icon, index) => (
                <div
                  key={index}
                  className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition duration-300 cursor-pointer"
                >
                  <Icon />
                </div>
              )
            )}
          </div>
        </div>
        {/* ================= Contact Form Section ================= */}
<div className="mt-20 bg-white rounded-2xl shadow-xl p-8 md:p-14 border border-gray-100">
  <div className="text-center mb-12">
    <p className="text-orange-500 font-semibold tracking-wider uppercase text-sm">
      Send Message
    </p>
    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-3">
      Message Us for Assistance
    </h2>
  </div>

  <form className="grid md:grid-cols-2 gap-8">
    
    {/* Left Side */}
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Your Name
        </label>
        <input
          type="text"
          placeholder="Enter your full name"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Phone
        </label>
        <input
          type="text"
          placeholder="+1 Number"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Email
        </label>
        <input
          type="email"
          placeholder="Enter your email address"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Reason for Contact
        </label>
        <select
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition bg-white"
        >
          <option>Select Inquiry Type</option>
          <option>General Inquiry</option>
          <option>Shipping Information</option>
          <option>Pricing</option>
          <option>Support</option>
        </select>
      </div>
    </div>

    {/* Right Side */}
    <div className="flex flex-col">
      <label className="block text-sm font-medium text-gray-600 mb-2">
        Message
      </label>
      <textarea
        rows="10"
        placeholder="Write your message here..."
        className="w-full h-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition resize-none"
      ></textarea>
    </div>

    {/* Terms + Button */}
    <div className="md:col-span-2 mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <input type="checkbox" className="accent-orange-500" />
        <span>
          I agree to the{" "}
          <a href="#" className="text-orange-500 hover:underline">
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a href="#" className="text-orange-500 hover:underline">
            Privacy Policy
          </a>
        </span>
      </div>

      <button
        type="submit"
        className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition duration-300"
      >
        Send Your Request
      </button>
    </div>
  </form>
</div>
      </div>
    </div>
  );
}

export default Contact;