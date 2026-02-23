// components/EcommerceSectors.jsx
'use client';
import React, { useState } from 'react';

const EcommerceSectors = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  const sectors = [
    {
      id: 1,
      number: "01",
      title: "Quality Management System",
      description: "Service & Aftermarket Logistics",
      fullText: "With our worldwide inclusion, strong transportation organization and industry driving coordinations experience, our Service and Aftermarket Logistics arrangements.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 2,
      number: "02",
      title: "E-commerce Logistics",
      description: "End-to-end e-commerce solutions",
      fullText: "End-to-end e-commerce logistics with smart warehousing, real-time tracking, and optimized last-mile delivery for modern digital commerce.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      id: 3,
      number: "03",
      title: "Aftermarket Logistics",
      description: "Service parts distribution",
      fullText: "Comprehensive after-sales logistics including parts distribution, reverse logistics, and field service coordination for maximum customer satisfaction.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      id: 4,
      number: "04",
      title: "Industry Competence",
      description: "Specialized sector expertise",
      fullText: "Specialized logistics solutions designed for automotive, healthcare, technology, and industrial manufacturing sectors with industry-specific expertise.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Fixed Background with Parallax Effect */}
      <div 
        className="absolute inset-0 bg-fixed bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/products.jpg')`,
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/40"></div>
        
        {/* Animated Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        ></div>

        {/* Floating Particles Effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Scrollable Content with Smooth Scroll */}
      <div className="relative z-10 h-full overflow-y-auto scroll-smooth">
        <div className="min-h-full flex items-center">
          <div className="w-full py-20 px-4 sm:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto"> 

              {/* Sectors Grid with Enhanced Design */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {sectors.map((sector, index) => (
                  <div
                    key={sector.id}
                    className="group relative transform transition-all duration-500 hover:-translate-y-2"
                    onMouseEnter={() => {
                      setHoveredIndex(index);
                      setActiveIndex(index);
                    }}
                    onMouseLeave={() => {
                      setHoveredIndex(null);
                      setActiveIndex(null);
                    }}
                  >
                    {/* Card with Glassmorphism Effect */}
                    <div className={`
                      relative p-8 rounded-2xl transition-all duration-500
                      ${hoveredIndex === index 
                        ? 'bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl' 
                        : hoveredIndex !== null 
                          ? 'opacity-40 blur-[1px]' 
                          : 'bg-black/20 backdrop-blur-sm'
                      }
                    `}>
                      {/* Decorative Elements */}
                      <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-bl-full"></div>
                      </div>

                      {/* Icon */}
                      <div className={`
                        mb-6 transition-all duration-500
                        ${hoveredIndex === index ? 'text-blue-400 scale-110' : 'text-white/60'}
                      `}>
                        {sector.icon}
                      </div>

                      {/* Number with Gradient */}
                      <div className="text-6xl font-light bg-gradient-to-br from-white/20 to-white/5 bg-clip-text text-transparent mb-4">
                        {sector.number}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-medium text-white mb-3 tracking-wide">
                        {sector.title}
                      </h3>

                      {/* Description with Smooth Transition */}
                      <div className="min-h-[80px]">
                        <p className={`
                          text-sm leading-relaxed transition-all duration-500
                          ${hoveredIndex === index 
                            ? 'text-white/90 translate-x-0' 
                            : 'text-white/50'
                          }
                        `}>
                          {hoveredIndex === index ? sector.fullText : sector.description}
                        </p>
                      </div>

                      {/* Animated Learn More Link */}
                      <div className="mt-6">
                        <button className={`
                          inline-flex items-center gap-2 text-sm font-light transition-all duration-300
                          ${hoveredIndex === index ? 'text-blue-400' : 'text-white/30'}
                        `}>
                          <span>Learn More</span>
                          <svg 
                            className={`
                              w-4 h-4 transition-all duration-300
                              ${hoveredIndex === index ? 'translate-x-1' : ''}
                            `} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Animated Border Line */}
                    <div className={`
                      absolute -bottom-2 left-0 right-0 h-0.5 transition-all duration-500
                      ${hoveredIndex === index 
                        ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 scale-x-100' 
                        : 'scale-x-0 bg-transparent'
                      }
                    `}></div>

                    {/* Glow Effect */}
                    <div className={`
                      absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 blur-xl transition-opacity duration-500 -z-10
                      ${hoveredIndex === index ? 'opacity-30' : ''}
                    `}></div>
                  </div>
                ))}
              </div> 
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default EcommerceSectors;