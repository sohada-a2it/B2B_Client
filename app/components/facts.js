// app/page.tsx or components/InterestingFacts.tsx
import React from 'react';

const InterestingFacts = () => {
  const facts = [
    {
      id: 1,
      title: 'WAREHOUSE',
      value: '400k',
      unit: 'sq.ft',
      description: 'Space for efficient storage & Management.',
      icon: '🏭'
    },
    {
      id: 2,
      title: 'ON-TIME DELIVERIES',
      value: '98',
      unit: '%',
      description: 'Our shipments arrive on or before schedule.',
      icon: '⏱️'
    },
    {
      id: 3,
      title: 'WEEKLY SHIPMENTS',
      value: '5\'000',
      unit: '',
      description: 'Shipments expertly handled every week.',
      icon: '📦'
    },
    {
      id: 4,
      title: 'INDUSTRY AWARDS',
      value: '25',
      unit: '',
      description: 'Industry awards in the past decade.',
      icon: '🏆'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 md:px-10 py-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-3">
                DID YOU KNOW?
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                INTERESTING <br className="hidden sm:block" />FACTS
              </h1>
            </div>
            <div className="text-white/30 text-8xl md:text-9xl font-black select-none">
              ⚡
            </div>
          </div>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mt-4 font-light">
            Milestones and Metrics That Matter
          </p>
        </div>

        {/* Stats Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
          {facts.map((fact) => (
            <div 
              key={fact.id}
              className="p-6 md:p-8 hover:bg-gray-50 transition-all duration-300 group"
            >
              <div className="flex flex-col h-full">
                {/* Icon */}
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {fact.icon}
                </div>
                
                {/* Title */}
                <h3 className="text-sm font-semibold text-gray-500 tracking-wider mb-2">
                  {fact.title}
                </h3>
                
                {/* Value */}
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl md:text-5xl font-bold text-gray-800">
                    {fact.value}
                  </span>
                  {fact.unit && (
                    <span className="text-xl md:text-2xl font-medium text-amber-600 ml-1">
                      {fact.unit}
                    </span>
                  )}
                </div>
                
                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {fact.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer with Link */}
        <div className="bg-gray-50 px-6 md:px-10 py-5 border-t border-gray-200">
          <a 
            href="https://cargologisticscompany.com/#" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium transition-colors duration-200 group"
          >
            <span>cargologisticscompany.com</span>
            <svg 
              className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default InterestingFacts;