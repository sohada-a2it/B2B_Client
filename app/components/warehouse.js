'use client';

import React, { useState } from 'react';

const TestimonialsSection = () => {
  // Brand colors
  const colors = {
    primary: '#FD5621',
    secondary: '#122652',
  };

  // State for button hover
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  // Testimonials data
  const testimonials = [
    {
      rating: 5,
      title: '“Great Work!”',
      content:
        'I work in project management and joined Unicoach because I get great courses for less. The instructors are fantastic, interesting, and helpful. I plan to use for a long time!',
      name: 'Anna Ingrosso',
      role: 'CLIENT OF COMPANY',
      initial: 'A',
    },
    {
      rating: 5,
      title: '“Perfect Results!”',
      content:
        'I work in project management and joined Unicoach because I get great courses for less. The instructors are fantastic, interesting, and helpful. I plan to use for a long time!',
      name: 'Tomm Skywalker',
      role: 'CLIENT OF COMPANY',
      initial: 'T',
    },
  ];

  return (
    <div className="w-full bg-white py-16 px-4 sm:px-6 lg:py-24 relative">
      {/* Background pattern exactly like the image - subtle dots/lines */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25px 25px, ${colors.secondary} 1px, transparent 1px),
            linear-gradient(to right, ${colors.secondary}05 1px, transparent 1px),
            linear-gradient(to bottom, ${colors.secondary}05 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px, 50px 50px, 50px 50px',
          opacity: 0.3,
        }}
      ></div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header Section - matches image exactly */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: colors.secondary }}>
            People Say About Our Company
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Transmax is the world's driving worldwide coordinations supplier — we uphold industry and 
            exchange the worldwide trade.
          </p>
          
          {/* ALL TESTIMONIALS link - exactly like image */}
          <div className="mt-6">
            <button 
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full border-2 font-medium transition-all duration-300 hover:shadow-lg"
              style={{ 
                borderColor: colors.primary,
                color: isButtonHovered ? 'white' : colors.primary,
                backgroundColor: isButtonHovered ? colors.primary : 'transparent',
              }}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
            >
              ALL TESTIMONIALS
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Dashed divider - exactly as shown in image */}
        <div className="relative mb-16">
          <div 
            className="border-t-2 border-dashed w-full" 
            style={{ borderColor: `${colors.secondary}30` }}
          ></div>
          <div 
            className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45"
            style={{ backgroundColor: colors.primary }}
          ></div>
        </div>

        {/* Testimonials Grid - 2 columns like image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Decorative corner accent - matches image style */}
              <div 
                className="absolute top-0 right-0 w-16 h-16 overflow-hidden"
              >
                <div 
                  className="absolute top-0 right-0 w-16 h-16 bg-opacity-10"
                  style={{ backgroundColor: colors.primary }}
                >
                  <div 
                    className="absolute top-2 right-2 w-8 h-8"
                    style={{ 
                      background: `linear-gradient(135deg, transparent 50%, ${colors.primary}20 50%)` 
                    }}
                  ></div>
                </div>
              </div>

              {/* Quote marks - decorative */}
              <div 
                className="absolute top-6 left-6 text-6xl font-serif opacity-10"
                style={{ color: colors.secondary }}
              >
                &ldquo;
              </div>

              {/* Rating Stars */}
              <div className="flex gap-1 mb-4 relative z-10">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5"
                    fill={i < testimonial.rating ? colors.primary : 'none'}
                    stroke={colors.primary}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                ))}
              </div>

              {/* Title with quotes */}
              <h3 
                className="text-2xl font-bold mb-3 relative z-10"
                style={{ color: colors.secondary }}
              >
                {testimonial.title}
              </h3>

              {/* Content */}
              <p className="text-gray-600 mb-6 leading-relaxed relative z-10">
                {testimonial.content}
              </p>

              {/* Author Info - exactly like image */}
              <div className="flex items-center gap-4 relative z-10">
                {/* Avatar with initial - matches the image style */}
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl"
                  style={{ 
                    background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)` 
                  }}
                >
                  {testimonial.initial}
                </div>
                <div>
                  <h4 className="font-bold text-lg" style={{ color: colors.secondary }}>
                    {testimonial.name}
                  </h4>
                  <p className="text-sm tracking-wider" style={{ color: colors.primary }}>
                    {testimonial.role}
                  </p>
                </div>
              </div>

              {/* Decorative line - subtle accent */}
              <div 
                className="absolute bottom-0 left-8 right-8 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ 
                  background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)` 
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Navigation Dots - like many testimonial sections have */}
        <div className="flex justify-center gap-2 mt-12">
          {[0, 1, 2, 3].map((dot) => (
            <button
              key={dot}
              className="rounded-full transition-all duration-300"
              style={{ 
                backgroundColor: dot === 0 ? colors.primary : `${colors.secondary}30`,
                width: dot === 0 ? '2rem' : '0.625rem',
                height: '0.625rem',
              }}
              aria-label={`Go to slide ${dot + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;