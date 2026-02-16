// components/IndustriesSection.jsx
'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, ShoppingBag, Factory, HeartPulse, Cpu, Package,
  Zap, Rocket, Coffee, Fuel, FlaskConical, Building2,
  ArrowUpRight, Users, Globe, TrendingUp
} from 'lucide-react';

const IndustriesSection = () => {
  const [activeIndustry, setActiveIndustry] = useState('Automotive');
  const [hoveredIndustry, setHoveredIndustry] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  const industries = [
    { 
      id: 1, 
      name: 'Automotive', 
      icon: Car, 
      image: '/images/automotive.jpg',
      description: 'EV components, autonomous systems, and smart manufacturing solutions',
      stats: { projects: '150+', clients: '45+', growth: '28%' }
    },
    { 
      id: 2, 
      name: 'Retail', 
      icon: ShoppingBag, 
      image: '/images/retail.jpg',
      description: 'Omnichannel platforms, inventory management, and customer analytics',
      stats: { projects: '200+', clients: '80+', growth: '35%' }
    },
    { 
      id: 3, 
      name: 'Manufacturing', 
      icon: Factory, 
      image: '/images/manufacturing.jpg',
      description: 'Industry 4.0, predictive maintenance, and supply chain optimization',
      stats: { projects: '180+', clients: '60+', growth: '42%' }
    },
    { 
      id: 4, 
      name: 'Healthcare', 
      icon: HeartPulse, 
      image: '/images/healthcare.jpg',
      description: 'Telemedicine platforms, EHR systems, and medical imaging AI',
      stats: { projects: '120+', clients: '35+', growth: '52%' }
    },
    { 
      id: 5, 
      name: 'Technology', 
      icon: Cpu, 
      image: '/images/technology.jpg',
      description: 'Cloud solutions, IoT platforms, and enterprise software',
      stats: { projects: '250+', clients: '95+', growth: '45%' }
    },
    { 
      id: 6, 
      name: 'Consumer Goods', 
      icon: Package, 
      image: '/images/goods.jpg',
      description: 'Supply chain visibility and direct-to-consumer platforms',
      stats: { projects: '140+', clients: '55+', growth: '31%' }
    },
    { 
      id: 7, 
      name: 'Energy', 
      icon: Zap, 
      image: '/images/energy.jpg',
      description: 'Smart grid management and renewable energy optimization',
      stats: { projects: '90+', clients: '25+', growth: '38%' }
    },
    { 
      id: 8, 
      name: 'Aerospace', 
      icon: Rocket, 
      image: '/images/aerospace.jpg',
      description: 'Flight systems, maintenance tracking, and simulation software',
      stats: { projects: '75+', clients: '20+', growth: '33%' }
    },
    { 
      id: 9, 
      name: 'Food & Beverage', 
      icon: Coffee, 
      image: '/images/foods.jpg',
      description: 'Quality control systems and supply chain traceability',
      stats: { projects: '110+', clients: '40+', growth: '29%' }
    },
    { 
      id: 10, 
      name: 'Oil & Gas', 
      icon: Fuel, 
      image: '/images/oil gas.jpg',
      description: 'Exploration analytics and pipeline monitoring solutions',
      stats: { projects: '85+', clients: '22+', growth: '24%' }
    },
    { 
      id: 11, 
      name: 'Chemicals', 
      icon: FlaskConical, 
      image: '/images/chemical.jpg',
      description: 'Process optimization and safety compliance systems',
      stats: { projects: '95+', clients: '30+', growth: '27%' }
    },
    { 
      id: 12, 
      name: 'Building', 
      icon: Building2, 
      image: '/images/building.jpg',
      description: 'Smart building automation and construction management',
      stats: { projects: '130+', clients: '48+', growth: '36%' }
    },
  ];

  const activeData = industries.find(ind => ind.name === activeIndustry) || industries[0];
  const displayData = hoveredIndustry ? 
    industries.find(ind => ind.name === hoveredIndustry) || activeData : 
    activeData;
  
  const handleImageError = (industryName) => {
    setImageErrors(prev => ({ ...prev, [industryName]: true }));
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="text-[#122652]">Industries We</span>
            <span className="text-[#FD5621]"> Serve</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Delivering innovative solutions across 12+ industries worldwide
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side - Industries Grid */}
          <div className="lg:w-2/3">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {industries.map((industry) => {
                const Icon = industry.icon;
                const isActive = activeIndustry === industry.name;
                const isHovered = hoveredIndustry === industry.name;
                
                return (
                  <motion.button
                    key={industry.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveIndustry(industry.name)}
                    onHoverStart={() => setHoveredIndustry(industry.name)}
                    onHoverEnd={() => setHoveredIndustry(null)}
                    className={`
                      relative p-3 rounded-xl transition-all duration-300 group
                      ${isActive || isHovered
                        ? 'bg-[#FD5621] text-white shadow-lg' 
                        : 'bg-gray-50 text-[#122652] hover:bg-[#FD5621]/10 border border-gray-100'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs font-medium block truncate">
                      {industry.name}
                    </span>
                    
                    {/* Hover Tooltip - Small Screen এ দেখানোর জন্য */}
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-[#122652] text-white text-xs rounded-lg py-1 px-3 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 hidden sm:block">
                      {industry.description.substring(0, 30)}...
                      <div className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#122652] rotate-45"></div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
            
            {/* Selected Industry Description - Mobile View */}
            <div className="mt-4 lg:hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndustry}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-gradient-to-r from-[#FD5621]/10 to-[#122652]/10 p-4 rounded-xl"
                >
                  <h3 className="font-semibold text-[#122652] mb-2">{activeData.name}</h3>
                  <p className="text-sm text-gray-600">{activeData.description}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Side - Image Display with Hover Details */}
          <div className="lg:w-1/3">
            <AnimatePresence mode="wait">
              <motion.div
                key={hoveredIndustry || activeIndustry}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative h-48 rounded-xl overflow-hidden shadow-lg group cursor-pointer"
                onHoverStart={() => setHoveredIndustry(displayData.name)}
                onHoverEnd={() => setHoveredIndustry(null)}
              >
                {!imageErrors[displayData.name] ? (
                  <>
                    <Image
                      src={displayData.image}
                      alt={displayData.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={() => handleImageError(displayData.name)}
                      priority
                    />
                    {/* Dark Overlay - hover effect এর জন্য */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                  </>
                ) : (
                  // Fallback (যদি ইমেজ না থাকে)
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FD5621] to-[#122652] transition-transform duration-700 group-hover:scale-110">
                    <displayData.icon className="absolute inset-0 w-24 h-24 text-white/10 mx-auto my-auto" />
                  </div>
                )}
                
                {/* Default Content (Always Visible) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                  <h3 className="text-white font-semibold text-lg">{displayData.name}</h3>
                  <p className="text-white/70 text-xs line-clamp-1">{displayData.description}</p>
                </div>

                {/* Hover Details (Shows on Hover) */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-br from-[#FD5621]/95 to-[#122652]/95 p-5 flex flex-col justify-center items-start opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <h4 className="text-white font-bold text-xl mb-2">{displayData.name}</h4>
                  <p className="text-white/90 text-sm mb-4">{displayData.description}</p>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 w-full mb-4">
                    <div className="text-center">
                      <div className="text-white font-bold text-sm">{displayData.stats.projects}</div>
                      <div className="text-white/70 text-[10px]">Projects</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-bold text-sm">{displayData.stats.clients}</div>
                      <div className="text-white/70 text-[10px]">Clients</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-bold text-sm">{displayData.stats.growth}</div>
                      <div className="text-white/70 text-[10px]">Growth</div>
                    </div>
                  </div>

                  {/* Key Solutions */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full">AI Solutions</span>
                    <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full">Analytics</span>
                    <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full">Cloud</span>
                  </div>

                  {/* Learn More Button */}
                  <motion.button 
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-1 text-white text-xs font-medium border-b border-white/50 pb-0.5"
                  >
                    Learn More <ArrowUpRight className="w-3 h-3" />
                  </motion.button>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Quick Stats (Below Image) */}
            <motion.div 
              key={displayData.name + "-stats"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 grid grid-cols-3 gap-2"
            >
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <div className="flex items-center justify-center gap-1 text-[#FD5621] mb-1">
                  <Users className="w-3 h-3" />
                  <span className="text-xs font-medium text-[#122652]">Clients</span>
                </div>
                <span className="text-sm font-bold text-[#122652]">{displayData.stats.clients}</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <div className="flex items-center justify-center gap-1 text-[#FD5621] mb-1">
                  <Globe className="w-3 h-3" />
                  <span className="text-xs font-medium text-[#122652]">Countries</span>
                </div>
                <span className="text-sm font-bold text-[#122652]">15+</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <div className="flex items-center justify-center gap-1 text-[#FD5621] mb-1">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs font-medium text-[#122652]">Growth</span>
                </div>
                <span className="text-sm font-bold text-[#122652]">{displayData.stats.growth}</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* CTA Button */}
        {/* <div className="text-center mt-8">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2.5 bg-[#122652] text-white rounded-lg hover:bg-[#FD5621] transition-colors duration-300 text-sm font-medium shadow-md hover:shadow-lg inline-flex items-center gap-2 group"
          >
            View All Industries
            <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
          </motion.button>
        </div> */}
      </div>
    </section>
  );
};

export default IndustriesSection;