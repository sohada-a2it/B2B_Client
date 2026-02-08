"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Menu, X, ChevronDown, Home, FileText, User, Settings, File, Mail, Sparkles } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const primaryColor = '#246092';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 5);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    {
      label: 'Home',
      href: '#',
      icon: <Home className="w-4 h-4" />
    },
    {
      label: 'Pages',
      href: '#',
      icon: <FileText className="w-4 h-4" />,
      dropdown: [
        { label: 'Team', href: '#' },
        { label: 'Pricing', href: '#' },
        { label: 'Testimonials', href: '#' },
        { label: 'FAQ', href: '#' }
      ]
    },
    {
      label: 'About',
      href: '#',
      icon: <User className="w-4 h-4" />,
      dropdown: [
        { label: 'Our Story', href: '#' },
        { label: 'Mission', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Awards', href: '#' }
      ]
    },
    {
      label: 'Services',
      href: '#',
      icon: <Settings className="w-4 h-4" />,
      dropdown: [
        { label: 'Consulting', href: '#' },
        { label: 'Development', href: '#' },
        { label: 'Marketing', href: '#' },
        { label: 'Support', href: '#' }
      ]
    },
    {
      label: 'Blog',
      href: '#',
      icon: <File className="w-4 h-4" />
    },
    {
      label: 'Contact',
      href: '#',
      icon: <Mail className="w-4 h-4" />
    }
  ];

  const DropdownMenu = ({ items, isMobile = false }) => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`absolute left-0 mt-2 ${isMobile ? 'relative ml-3 mt-1' : 'min-w-[200px]'} bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50`}
      style={{ maxWidth: 'calc(100vw - 2rem)' }}
    >
      {items.map((item, idx) => (
        <motion.a
          key={item.label}
          href={item.href}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
          whileHover={{ x: 5, backgroundColor: '#f0f7ff' }}
          className="block px-4 py-3 text-sm text-gray-700 hover:text-[#246092] hover:font-medium transition-all"
          onClick={() => setIsMenuOpen(false)}
        >
          {item.label}
        </motion.a>
      ))}
    </motion.div>
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-sm py-2 shadow-sm' : 'bg-white py-3'} w-full overflow-hidden`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex items-center justify-between">
          
          {/* Logo - Fixed overflow issue */}
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            className="flex items-center space-x-2 flex-shrink-0"
          >
            <div className="relative overflow-visible">
              {/* Removed -inset-1 that causes overflow */}
              <div className="absolute inset-0 bg-[#246092] rounded-lg opacity-20 scale-105" />
              <div  
                className="relative px-4 py-2 rounded-lg bg-secondary"
              >
                <h1 className=" text-xl font-bold text-white">Cargo Logistics Company</h1>
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300" />
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 flex-shrink-0">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
                onMouseLeave={() => item.dropdown && setActiveDropdown(null)}
              >
                <motion.a
                  href={item.href}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-1 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:text-[#246092] group flex-shrink-0"
                >
                  {item.icon && <span className="opacity-60 group-hover:opacity-100">{item.icon}</span>}
                  <span className="whitespace-nowrap">{item.label}</span>
                  {item.dropdown && (
                    <ChevronDown className={`w-3 h-3 transition-transform flex-shrink-0 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                  )}
                </motion.a>

                {/* Active Indicator */}
                <motion.div
                  className="absolute bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 rounded-full"
                  style={{ backgroundColor: primaryColor }}
                  initial={{ width: 0 }}
                  animate={{ width: activeDropdown === item.label ? '60%' : 0 }}
                />

                {/* Dropdown - Fixed positioning */}
                <AnimatePresence>
                  {item.dropdown && activeDropdown === item.label && (
                    <div className="absolute left-0 top-full z-50">
                      <DropdownMenu items={item.dropdown} />
                    </div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Contact Button */}
          <div className="hidden lg:flex items-center space-x-2 flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }} 
              className="flex items-center space-x-2 px-4 py-2.5 rounded-lg text-white shadow-sm whitespace-nowrap bg-secondary"
            >
              <Phone className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-semibold">+1 (514) 312-5678</span>
            </motion.div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ 
                backgroundColor: 'white',
                color: primaryColor,
                border: `1px solid ${primaryColor}`
              }}
              className="px-4 py-2.5 rounded-lg text-sm font-semibold hover:shadow-sm transition-shadow whitespace-nowrap"
            >
              Call Now
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg flex-shrink-0"
            style={{ backgroundColor: '#f8fafc' }}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>

        {/* Mobile Menu - Fixed overflow */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden mt-3"
            >
              <div className="bg-white rounded-lg shadow-sm border py-4 max-w-full">
                <div className="space-y-1 px-3">
                  {navItems.map((item) => (
                    <div key={item.label} className="relative">
                      <div
                        onClick={() => item.dropdown ? setActiveDropdown(
                          activeDropdown === item.label ? null : item.label
                        ) : setIsMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-blue-50 cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          {item.icon}
                          <span className="font-medium text-gray-700">{item.label}</span>
                        </div>
                        {item.dropdown && (
                          <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                        )}
                      </div>

                      {/* Mobile Dropdown */}
                      {item.dropdown && activeDropdown === item.label && (
                        <div className="ml-6 mt-1 mb-2">
                          <DropdownMenu items={item.dropdown} isMobile />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Mobile Contact */}
                <div className="mt-4 pt-4 border-t px-3">
                  <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#f0f7ff' }}>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" style={{ color: primaryColor }} />
                      <span className="font-semibold" style={{ color: primaryColor }}>
                        +1 (514) 312-5678
                      </span>
                    </div>
                  </div>
                  
                  <button
                    style={{ backgroundColor: primaryColor }}
                    className="w-full text-white py-3 rounded-lg font-semibold hover:shadow-sm transition-shadow"
                  >
                    Call Now
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;