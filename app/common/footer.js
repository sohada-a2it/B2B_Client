"use client";

import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, ChevronRight, Facebook, Twitter, Linkedin, Instagram, Globe } from 'lucide-react';

const footer = () => { 

  const footerSections = [
    {
      title: "Contact Info",
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-third mb-2">HEAD OFFICE</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              8825 STANFORD BLVD<br />
              SUITE 306 COLUMBIA<br />
              MD 21045, United States
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-third mb-2">PHONE</h3>
            <a href="tel:+1-647-362-7735" className="text-gray-600 text-sm hover:text-primary transition-colors flex items-center gap-2">
              <Phone className="w-4 h-4" />
              +1-647-362-7735
            </a>
          </div>
          
          <div>
            <h3 className="font-semibold text-third mb-2">EMAIL</h3>
            <a href="mailto:info@cargologisticscompany.com" className="text-gray-600 text-sm hover:text-primary transition-colors flex items-center gap-2">
              <Mail className="w-4 h-4" />
              info@cargologisticscompany.com
            </a>
          </div>
          
          <div>
            <h3 className="font-semibold text-third mb-3">SOCIAL CONNECT:</h3>
            <div className="flex gap-3">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, idx) => (
                <motion.a
                  key={idx}
                  href="#"
                  whileHover={{ y: -3 }}
                  className="w-8 h-8 bg-primary/20 hover:bg-primary hover:text-white rounded-lg flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4 text-gray-600" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Links",
      links: [
        "Our Company",
        "History",
        "Leadership Team",
        "Mission & Vision",
        "Certifications",
        "Global Network",
        "Why Choose Us",
        "Careers"
      ]
    },
    {
      title: "Essentials",
      links: [
        "Services",
        "Transportations",
        "Industries Served",
        "Free Estimation",
        "Booking",
        "Tracking",
        "How It's Work",
        "FAQs"
      ]
    },
    {
      title: "Work Gallery",
      content: (
        <div>
          {/* <p className="text-gray-600 text-sm mb-4">
            FIND NEAREST BRANCH
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ backgroundColor: gray-600Color }}
            className="px-6 py-3 rounded-lg text-primary font-semibold text-sm hover:shadow-lg transition-shadow inline-flex items-center gap-2"
          >
            FIND NEAREST BRANCH
            <ChevronRight className="w-4 h-4" />
          </motion.button> */}
          
          {/* Sample Gallery Images - You can replace with actual images */}
          <div className="grid grid-cols-3 gap-2 mt-6">
  {[
    { id: 1, src: "/images/gal1.jpg", alt: "Gallery image 1" },
    { id: 2, src: "/images/gal2.jpg", alt: "Gallery image 2" },
    { id: 3, src: "/images/gal3.jpg", alt: "Gallery image 3" },
    { id: 4, src: "/images/gal4.jpg", alt: "Gallery image 4" },
    { id: 5, src: "/images/gal5.jpg", alt: "Gallery image 5" },
    { id: 6, src: "/images/gal6.jpg", alt: "Gallery image 6" }
  ].map((item) => (
    <motion.div
      key={item.id}
      whileHover={{ scale: 1.05 }}
      className="aspect-square bg-primary/10 rounded-lg overflow-hidden cursor-pointer"
    >
      <img 
        src={item.src} 
        alt={item.alt}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/150?text=Gallery";
        }}
      />
    </motion.div>
  ))}
</div>
        </div>
      )
    }
  ];

  return (
    <footer className="bg-secondary text-third relative overflow-hidden"> 

      {/* Main Footer */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-4 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {footerSections.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <h2 className="text-lg font-bold mb-6 relative inline-block">
                {section.title}
                <motion.div
                  className="absolute -bottom-2 left-0 h-0.5 rounded-full bg-primary" 
                  initial={{ width: 0 }}
                  animate={{ width: '60%' }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                />
              </h2>

              {section.links ? (
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <motion.li
                      key={link}
                      whileHover={{ x: 5 }}
                      className="text-sm"
                    >
                      <a
                        href="#"
                        className="text-gray-600 hover:text-primary transition-colors inline-flex items-center gap-2"
                      >
                        <ChevronRight className="w-3 h-3 text-primary" />
                        {link}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                section.content
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className=" bg-primary mt-16 pt-8 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-gray-600 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Cargo Logistics Company. All rights reserved.
          </p>
          
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-600 hover:text-[#FD5621] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 hover:text-[#FD5621] transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-600 hover:text-[#FD5621] transition-colors">
              Cookie Policy
            </a>
          </div>
        </motion.div> */}
      </div>
    </footer>
  );
};

export default footer;