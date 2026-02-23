"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const StylishPartnerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredId, setHoveredId] = useState(null);

  const partners = [
    {
      id: 1,
      category: "DAILY NEWS",
      title: "New Generation",
      image: "/images/partner (1).png",
      activeImage: "/images/partner-active (1).png",
      color: "#FD5621",
    },
    {
      id: 2,
      category: "TECHNOLOGY",
      title: "HIGH PERFORMANCE",
      image: "/images/partner (2).png",
      activeImage: "/images/partner-active (2).png",
      color: "#122652",
    },
    {
      id: 3,
      category: "FURTURATECH",
      title: "INNOVATIVE SOLUTION",
      image: "/images/partner (3).png",
      activeImage: "/images/partner-active (3).png",
      color: "#FD5621",
    },
    {
      id: 4,
      category: "CYBERTECH",
      title: "SECURITY MADE SIMPLE",
      image: "/images/partner (4).png",
      activeImage: "/images/partner-active (4).png",
      color: "#122652",
    },
    {
      id: 5,
      category: "ART STUDIO",
      title: "STYLISH, MODERN",
      image: "/images/partner (5).png",
      activeImage: "/images/partner-active (5).png",
      color: "#FD5621",
    },
    {
      id: 6,
      category: "MORIOX",
      title: "High Performance",
      image: "/images/partner (6).png",
      activeImage: "/images/partner-active (6).png",
      color: "#122652",
    },
    {
      id: 7,
      category: "MORIOX",
      title: "High Performance",
      image: "/images/partner (7).png",
      activeImage: "/images/partner-active (7).png",
      color: "#FD5621",
    },
    {
      id: 8,
      category: "MORIOX",
      title: "High Performance",
      image: "/images/partner (8).png",
      activeImage: "/images/partner-active (8).png",
      color: "#122652",
    },
    {
      id: 9,
      category: "MORIOX",
      title: "High Performance",
      image: "/images/partner (9).png",
      activeImage: "/images/partner-active (9).png",
      color: "#FD5621",
    },
    {
      id: 10,
      category: "MORIOX",
      title: "High Performance",
      image: "/images/partner (10).png",
      activeImage: "/images/partner-active (10).png",
      color: "#122652",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % partners.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [partners.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + partners.length) % partners.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % partners.length);
  };

  const activePartner = partners[currentSlide];

  return (
    <div className="relative p-6 my-10 rounded-3xl shadow-2xl max-w-5xl mx-auto border border-gray-100">
      {/* Header - Compact */}
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-0.5">
          <h2 className="text-xl font-light text-gray-600 tracking-wide">
            Collaborating with
          </h2>
          <h1
            className="text-3xl font-black tracking-tight transition-colors duration-300"
            style={{ color: activePartner.color }}
          >
            THE BEST
          </h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-100 group"
          >
            <span className="text-gray-600 group-hover:text-gray-900 text-lg">
              ←
            </span>
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-100 group"
          >
            <span className="text-gray-600 group-hover:text-gray-900 text-lg">
              →
            </span>
          </button>
        </div>
      </div>

      {/* All Partners Grid - 5x2 = 10 items */}
      <div className="grid grid-cols-5 grid-rows-2 gap-3">
        {partners.map((partner) => {
          const isActive = partner.id === activePartner.id;
          const isHovered = hoveredId === partner.id;

          // Show active image if: item is active OR item is being hovered
          const showActiveImage = isActive || isHovered;

          return (
            <div
              key={partner.id}
              onClick={() =>
                setCurrentSlide(partners.findIndex((p) => p.id === partner.id))
              }
              onMouseEnter={() => setHoveredId(partner.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative h-36 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 group"
              style={{
                transform: isActive ? "scale(1.02)" : "scale(1)",
                boxShadow: isActive
                  ? `0 15px 25px -10px ${partner.color}40`
                  : "0 5px 15px -5px rgba(0,0,0,0.1)",
              }}
            >
              {/* Image with fade transition - No overlay */}
              <div className="absolute inset-0">
                {/* Inactive Image */}
                <div
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    showActiveImage ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <Image
                    src={partner.image}
                    alt={partner.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                </div>
                
                {/* Active Image */}
                <div
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    showActiveImage ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Image
                    src={partner.activeImage}
                    alt={partner.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                </div>
              </div>

              {/* Active Indicator Border */}
              {isActive && (
                <div
                  className="absolute inset-0 rounded-xl border-3 transition-all duration-300"
                  style={{
                    borderColor: partner.color,
                    boxShadow: `0 0 15px ${partner.color}`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Bar with Counter - Compact */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-1.5">
          {partners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className="group focus:outline-none"
            >
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "w-6 bg-orange-500"
                    : "w-2 bg-gray-300 group-hover:bg-gray-400"
                }`}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className="text-xl font-bold transition-colors duration-300"
            style={{ color: activePartner.color }}
          >
            {(currentSlide + 1).toString().padStart(2, "0")}
          </span>
          <span className="text-gray-400 text-xs">/</span>
          <span className="text-gray-400 text-xs">
            {partners.length.toString().padStart(2, "0")}
          </span>
        </div>
      </div> 
    </div>
  );
};

export default StylishPartnerSlider;