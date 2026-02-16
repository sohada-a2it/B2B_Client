// components/ServicesSection.jsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const ServicesSection = () => {
  const [hoveredId, setHoveredId] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const services = [
    {
      id: 1,
      title: "Land Transport",
      description: "With a worldwide organization and progressed coordination arrangements, our airship cargo sending items.",
      points: ["Part & Full Loads", "Multimodal Solutions", "Intermodal Solutions"],
      image: "/images/service1.jpg",
      icon: "fa-truck",
      gradient: "from-amber-500 to-orange-500",
      color: "#FD5621",
      bgGradient: "from-amber-500/10 to-orange-500/10",
      stats: { shipments: "10K+", countries: "50+", satisfaction: "98%" }
    },
    {
      id: 2,
      title: "Air Freight",
      description: "We help transport your load anyplace on the planet, making your business run easily regardless of where products.",
      points: ["General Air Freight Products", "Charter Services", "Intermodal Solutions"],
      image: "/images/service2.jpg",
      icon: "fa-plane",
      gradient: "from-sky-500 to-blue-500",
      color: "#0EA5E9",
      bgGradient: "from-sky-500/10 to-blue-500/10",
      stats: { shipments: "5K+", countries: "30+", satisfaction: "96%" }
    },
    {
      id: 3,
      title: "Ocean Freight",
      description: "Sea cargo dispatches in excess of 5,500 holders per day to ports all around the globe, making us a top forwarder.",
      points: ["Less-than-container Load", "Full Container Load", "Intermodal Solutions"],
      image: "/images/service3.jpg",
      icon: "fa-ship",
      gradient: "from-cyan-500 to-teal-500",
      color: "#06B6D4",
      bgGradient: "from-cyan-500/10 to-teal-500/10",
      stats: { shipments: "15K+", countries: "80+", satisfaction: "97%" }
    },
  ];

  return (
    <section ref={sectionRef} className="relative py-2 px-4 md:px-8 lg:px-16 min-h-screen overflow-hidden bg-white">
      
      {/* Luxury Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Dynamic Gradient Orbs */}
        <div 
          className="absolute w-[800px] h-[800px] rounded-full bg-gradient-to-r from-[#FD5621]/20 via-purple-600/20 to-blue-600/20 blur-3xl animate-pulse-slow"
          style={{
            left: `${mousePosition.x * 0.1}px`,
            top: `${mousePosition.y * 0.1}px`,
            transform: 'translate(-50%, -50%)',
          }}
        ></div>
        
        <div 
          className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-blue-600/20 via-cyan-600/20 to-emerald-600/20 blur-3xl animate-pulse-slower"
          style={{
            right: `${mousePosition.x * 0.05}px`,
            bottom: `${mousePosition.y * 0.05}px`,
            transform: 'translate(50%, 50%)',
          }}
        ></div>

        {/* Elegant Grid Pattern */}
        <div className="absolute inset-0 opacity-20" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        ></div>

        {/* Floating Particles with Glow */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle at center, ${i % 3 === 0 ? '#FD5621' : i % 3 === 1 ? '#0EA5E9' : '#06B6D4'}80, transparent)`,
              boxShadow: `0 0 20px ${i % 3 === 0 ? '#FD5621' : i % 3 === 1 ? '#0EA5E9' : '#06B6D4'}`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 15}s`,
            }}
          ></div>
        ))}

        {/* Animated Wave Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FD5621" stopOpacity="0">
                <animate attributeName="stop-color" values="#FD5621; #0EA5E9; #06B6D4; #FD5621" dur="10s" repeatCount="indefinite" />
              </stop>
              <stop offset="50%" stopColor="#FD5621" stopOpacity="1">
                <animate attributeName="stop-color" values="#0EA5E9; #06B6D4; #FD5621; #0EA5E9" dur="10s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#FD5621" stopOpacity="0">
                <animate attributeName="stop-color" values="#06B6D4; #FD5621; #0EA5E9; #06B6D4" dur="10s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
          </defs>
          {[...Array(3)].map((_, i) => (
            <path
              key={i}
              d={`M0,${50 + i * 20} Q${25 + scrollY * 0.1},${40 + i * 20} 50,${50 + i * 20} T100,${50 + i * 20}`}
              stroke="url(#wave-gradient)"
              strokeWidth="1"
              fill="none"
              className="animate-wave"
              style={{ animationDelay: `${i * 0.5}s` }}
            />
          ))}
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto z-10 py-10">
        {/* Header Section with Luxury Typography */}
        <div className="text-center mb-10 relative"> 

          {/* Main Title with 3D Effect */}
          <div className="relative inline-block">
            <h1 className="text-6xl md:text-2xl font-bold text-secondary bg-clip-text bg-gradient-to-r from-white via-gray-300 to-white mb-2 animate-fade-in relative z-10">
              Explore Our Services
            </h1> 

            {/* Decorative Lines */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-[#FD5621] to-transparent animate-expand-width"></div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-expand-width animation-delay-500"></div>
            
            {/* Floating Icons with Glow */}
            <div className="absolute -top-20 -left-20 w-24 h-24 animate-float-slow">
              <div className="relative">
                <div className="absolute inset-0 bg-[#FD5621]/20 rounded-full blur-2xl animate-pulse"></div>
                <i className="fas fa-truck text-5xl text-[#FD5621]/30"></i>
              </div>
            </div>
            <div className="absolute -bottom-20 -right-20 w-24 h-24 animate-float-slow animation-delay-2000">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse animation-delay-1000"></div>
                <i className="fas fa-ship text-5xl text-blue-500/30"></i>
              </div>
            </div>
            <div className="absolute top-1/2 -right-28 w-20 h-20 animate-float-slow animation-delay-1000">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-2xl animate-pulse animation-delay-2000"></div>
                <i className="fas fa-plane text-4xl text-cyan-500/30"></i>
              </div>
            </div>
          </div>

          <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed animate-fade-in-up mt-8">
            Transmax is the world's driving worldwide coordinations provider — 
            we uphold industry and exchange the worldwide exchange of merchandise through land transport.
          </p>  
        </div>

        {/* Services Grid - Modern Card Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="group relative rounded-3xl overflow-hidden cursor-pointer animate-fade-in-up transition-all duration-500"
              style={{ 
                animationDelay: `${index * 0.15}s`,
                height: hoveredId === service.id ? '550px' : '380px' // Height changes on hover
              }}
              onMouseEnter={() => setHoveredId(service.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Card Container with 3D Effect */}
              <div className={`absolute inset-0 transition-all duration-700 transform-gpu ${
                hoveredId === service.id ? 'scale-105 rotate-1' : 'scale-100 rotate-0'
              }`}>
                {/* Background Image with Parallax */}
                <div className="absolute inset-0 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className={`object-cover transition-all duration-1000 ${
                      hoveredId === service.id ? 'scale-110' : 'scale-100'
                    }`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    priority={index < 2}
                  />
                  
                  {/* Dynamic Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${
                    hoveredId === service.id 
                      ? 'from-black/90 via-black/50 to-transparent' 
                      : 'from-black/80 via-black/40 to-transparent'
                  } transition-all duration-700`}></div>
                  
                  {/* Color Accent Overlay */}
                  <div className={`absolute inset-0 mix-blend-overlay transition-opacity duration-700 ${
                    hoveredId === service.id ? 'opacity-30' : 'opacity-0'
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${service.color}40, transparent)`
                  }}></div>
                </div>

                {/* Animated Border */}
                <div className={`absolute inset-0 rounded-3xl border-2 transition-all duration-700 ${
                  hoveredId === service.id ? 'border-opacity-100 scale-100' : 'border-opacity-0 scale-95'
                }`}
                style={{
                  borderColor: service.color,
                  boxShadow: hoveredId === service.id ? `0 0 50px ${service.color}80` : 'none'
                }}></div>
              </div>

              {/* Card Content */}
              <div className={`absolute inset-0 p-8 transition-all duration-700 flex flex-col justify-between ${
                hoveredId === service.id ? 'bg-gradient-to-b from-black/40 via-black/20 to-black/60 backdrop-blur-[2px]' : ''
              }`}>
                
                {/* Top Section */}
                <div>
                  {/* Icon with Advanced Animation */}
                  <div className={`relative mb-6 transition-all duration-700 transform-gpu ${
                    hoveredId === service.id ? 'translate-y-0 scale-110' : 'translate-y-0 scale-100'
                  }`}>
                    <div className={`relative w-20 h-20 rounded-2xl flex items-center justify-center text-3xl overflow-hidden`}
                      style={{
                        background: hoveredId === service.id 
                          ? `linear-gradient(135deg, ${service.color}40, ${service.color}80)`
                          : 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${service.color}60`,
                        boxShadow: hoveredId === service.id ? `0 10px 30px ${service.color}40` : 'none'
                      }}>
                      
                      {/* Animated Background Wave */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${service.gradient} opacity-20 transition-transform duration-1000 ${
                        hoveredId === service.id ? 'translate-x-0' : '-translate-x-full'
                      }`}></div>
                      
                      {/* Rotating Ring */}
                      <div className={`absolute inset-0 rounded-2xl border-2 border-dashed transition-all duration-1000 ${
                        hoveredId === service.id ? 'rotate-180 opacity-100' : 'rotate-0 opacity-0'
                      }`}
                      style={{ borderColor: `${service.color}80` }}></div>
                      
                      <i className={`fas ${service.icon} relative z-10 transition-all duration-300 ${
                        hoveredId === service.id ? 'text-white scale-110' : 'text-gray-300'
                      }`} style={{ color: hoveredId === service.id ? 'white' : service.color }}></i>
                    </div>

                    {/* Glowing Ring Effect */}
                    <div className={`absolute -inset-3 rounded-2xl transition-all duration-700 ${
                      hoveredId === service.id ? 'opacity-100 scale-125' : 'opacity-0 scale-100'
                    }`}
                    style={{
                      background: `radial-gradient(circle at center, ${service.color}60 0%, transparent 70%)`,
                      filter: 'blur(15px)'
                    }}></div>
                  </div>

                  {/* Title with Gradient */}
                  <h3 className="text-3xl font-bold mb-3">
                    <span className={`bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}>
                      {service.title}
                    </span>
                  </h3>

                  {/* Description with Elegant Style */}
                  <p className="mb-6 leading-relaxed text-sm text-gray-300 line-clamp-2">
                    {service.description}
                  </p>

                  {/* Points List with Icons */}
                  <ul className="space-y-3">
                    {service.points.map((point, idx) => (
                      <li 
                        key={idx} 
                        className="flex items-center group/item transform transition-all duration-300 hover:translate-x-2"
                      >
                        <span className="relative flex items-center justify-center w-6 h-6 mr-3">
                          <span className={`absolute inset-0 rounded-full transition-all duration-300 ${
                            hoveredId === service.id ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                          }`}
                          style={{
                            background: `radial-gradient(circle at center, ${service.color}60, transparent)`
                          }}></span>
                          <i className={`fas fa-check-circle text-sm relative z-10 transition-all duration-300 ${
                            hoveredId === service.id ? 'opacity-100' : 'opacity-50'
                          }`}
                          style={{ color: service.color }}></i>
                        </span>
                        <span className="text-sm text-gray-300 group-hover/item:text-white transition-colors">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Section */}
                <div>
                  {/* Stats Preview */}
                  <div className={`grid grid-cols-3 gap-2 mb-4 transition-all duration-700 ${
                    hoveredId === service.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}>
                    {Object.entries(service.stats).map(([key, value], idx) => (
                      <div key={key} className="text-center">
                        <div className="text-lg font-bold" style={{ color: service.color }}>{value}</div>
                        <div className="text-xs text-gray-400 capitalize">{key}</div>
                      </div>
                    ))}
                  </div>

                  {/* Explore Button with Modern Design */}
                  <div className={`transition-all duration-700 ${
                    hoveredId === service.id
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-10'
                  }`}>
                    <button className="w-full group/btn relative overflow-hidden rounded-xl bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500">
                      <div className={`absolute inset-0 bg-gradient-to-r ${service.gradient} opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500`}></div>
                      
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                      
                      <div className="relative flex items-center justify-between px-6 py-2">
                        <span className="text-white font-semibold tracking-wider">EXPLORE SERVICE</span>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 transform group-hover/btn:rotate-45`}
                          style={{
                            background: `linear-gradient(135deg, ${service.color}, ${service.color}80)`,
                            boxShadow: `0 5px 15px ${service.color}80`
                          }}>
                          <i className="fas fa-arrow-right text-white text-sm"></i>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Corner Decorations */}
                <div className={`absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 transition-all duration-700 ${
                  hoveredId === service.id ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                }`} style={{ borderColor: service.color }}></div>
                <div className={`absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 transition-all duration-700 ${
                  hoveredId === service.id ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                }`} style={{ borderColor: service.color }}></div>
                
                {/* Floating Number */}
                <div className={`absolute top-6 right-6 text-6xl font-bold transition-all duration-700 ${
                  hoveredId === service.id ? 'opacity-20 translate-x-0' : 'opacity-0 translate-x-10'
                }`}
                style={{ color: service.color }}>
                  0{service.id}
                </div>
              </div>
            </div>
          ))}
        </div> 
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes expand-width {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            width: 100%;
            opacity: 1;
          }
        }
        
        @keyframes float-particle {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translate(100px, -100px) scale(1.5);
            opacity: 0.8;
          }
          50% {
            transform: translate(200px, 0) scale(1);
            opacity: 0.3;
          }
          75% {
            transform: translate(100px, 100px) scale(1.5);
            opacity: 0.8;
          }
        }
        
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-40px) rotate(10deg);
          }
        }
        
        @keyframes wave {
          0% {
            d: path("M0,50 Q25,40 50,50 T100,50");
          }
          50% {
            d: path("M0,50 Q25,60 50,50 T100,50");
          }
          100% {
            d: path("M0,50 Q25,40 50,50 T100,50");
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.05);
          }
        }
        
        @keyframes pulse-slower {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.1);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes spin-slower {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-expand-width {
          animation: expand-width 1.5s ease-out forwards;
        }
        
        .animate-float-particle {
          animation: float-particle 20s infinite ease-in-out;
        }
        
        .animate-float-slow {
          animation: float-slow 20s infinite ease-in-out;
        }
        
        .animate-wave {
          animation: wave 5s infinite ease-in-out;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s infinite ease-in-out;
        }
        
        .animate-pulse-slower {
          animation: pulse-slower 6s infinite ease-in-out;
        }
        
        .animate-spin-slow {
          animation: spin-slow 10s infinite linear;
        }
        
        .animate-spin-slower {
          animation: spin-slower 15s infinite linear;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default ServicesSection;