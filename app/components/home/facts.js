// app/page.tsx or components/InterestingFacts.tsx
import React from 'react';

const InterestingFacts = () => {
  const facts = [
    {
      id: 1,
      title: 'WAREHOUSE',
      value: '400k',
      unit: 'ft²',
      description: 'Strategic storage & distribution network',
      icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4'
    },
    {
      id: 2,
      title: 'ON-TIME',
      value: '98',
      unit: '%',
      description: 'Precision delivery performance',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
      id: 3,
      title: 'WEEKLY',
      value: '5K',
      unit: '',
      description: 'Shipments processed & tracked',
      icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4'
    },
    {
      id: 4,
      title: 'AWARDS',
      value: '25',
      unit: '',
      description: 'Industry recognition & excellence',
      icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
    }
  ];

  return (
    <section className="relative bg-white py-6 overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, black 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-medium text-gray-400 uppercase tracking-[0.3em]">
            Our Impact
          </span>
          <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mt-4 mb-6">
            Facts & Figures
          </h2>
          <div className="w-16 h-0.5 bg-gray-300 mx-auto"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200">
          {facts.map((fact, index) => (
            <div
              key={fact.id}
              className="bg-white p-8 group transition-all duration-300 hover:bg-gray-50"
            >
              {/* Icon */}
              <div className="mb-6">
                <svg 
                  className="w-8 h-8 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={fact.icon} />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                {fact.title}
              </h3>

              {/* Value */}
              <div className="flex items-baseline mb-3">
                <span className="text-5xl font-light text-gray-900">
                  {fact.value}
                </span>
                {fact.unit && (
                  <span className="text-lg text-gray-400 ml-1">
                    {fact.unit}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-500">
                {fact.description}
              </p>

              {/* Subtle Indicator */}
              <div className="mt-6">
                <div className="w-8 h-px bg-gray-300 group-hover:w-12 transition-all duration-300"></div>
              </div>
            </div>
          ))}
        </div> 
      </div>
    </section>
  );
};

export default InterestingFacts;