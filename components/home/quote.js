"use client";
import React, { useState } from 'react';

export default function RequestQuote() {
  // Form state
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    freightType: '',
    weight: '',
    dimensions: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    instructions: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Simple validation function
  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.origin.trim()) newErrors.origin = 'Origin is required';
    if (!formData.destination.trim()) newErrors.destination = 'Destination is required';
    if (!formData.freightType.trim()) newErrors.freightType = 'Freight type is required';
    if (!formData.weight.trim()) newErrors.weight = 'Weight is required';
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    // Weight validation (optional format check)
    if (formData.weight && !/^\d*\.?\d+\s*(kg|g|lb|lbs)?$/.test(formData.weight)) {
      newErrors.weight = 'Use format: 10kg, 5.5lbs';
    }

    // Dimensions validation (optional)
    if (formData.dimensions && !/^\d+\s*cm\s*x\s*\d+\s*cm\s*x\s*\d+\s*cm$/.test(formData.dimensions)) {
      newErrors.dimensions = 'Use: 120cm x 80cm x 60cm';
    }

    // Terms validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle blur
  const handleBlur = (field) => {
    // Trigger validation on blur for required fields
    if (!formData[field] && ['origin', 'destination', 'freightType', 'weight', 'name', 'email', 'phone', 'address'].includes(field)) {
      setErrors(prev => ({
        ...prev,
        [field]: `${field} is required`
      }));
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        console.log('Form submitted:', formData);
        setIsSubmitting(false);
        setSubmitSuccess(true);
        
        // Reset form after success
        setTimeout(() => {
          setSubmitSuccess(false);
          setFormData({
            origin: '', destination: '', freightType: '', weight: '', dimensions: '',
            name: '', email: '', phone: '', company: '', address: '',
            instructions: '', agreeToTerms: false
          });
          setErrors({});
        }, 3000);
      }, 1500);
    } else {
      console.log('Form has errors', errors);
    }
  };

  return (
    <section className="bg-secondary py-20 px-4 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto w-full">

        {/* Header */}
        <div className="mb-12 text-center md:text-left">
          <div className="flex items-center gap-2 text-[#F97316] uppercase tracking-widest text-sm font-semibold mb-3 justify-center md:justify-start">
            <span className="w-8 h-0.5 bg-[#F97316]"></span>
            Request a Quote
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#fff] via-[#F97316] to-[#FB923C] bg-clip-text text-transparent">
            Request Your Estimate
          </h2>
          <p className="text-[#fff] mt-4 max-w-2xl mx-auto md:mx-0">
            Get a personalized shipping quote within 24 hours. Fill out the form below with your cargo details.
          </p>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 p-4 bg-[#22C55E]/10 border border-[#22C55E] rounded-xl text-[#16A34A] flex items-center gap-2">
            <span className="text-xl">✓</span> Quote request sent successfully! We'll contact you within 24 hours.
          </div>
        )}

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white border border-[#F97316]/20 rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F97316]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F97316]/5 rounded-full blur-3xl"></div>
          
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 relative z-10">

            {/* Shipment Info */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-8 text-[#1E293B] flex items-center gap-2">
                <span className="w-1 h-6 bg-[#F97316] rounded-full"></span>
                Shipment & Cargo Details
              </h3>

              <Input
                label="Origin"
                name="origin"
                placeholder="Fes, Morocco"
                value={formData.origin}
                onChange={handleChange}
                onBlur={() => handleBlur('origin')}
                error={errors.origin}
                icon="🌍"
              />
              
              <Input
                label="Destination"
                name="destination"
                placeholder="Berlin, Germany"
                value={formData.destination}
                onChange={handleChange}
                onBlur={() => handleBlur('destination')}
                error={errors.destination}
                icon="📍"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Freight Type"
                  name="freightType"
                  placeholder="Rail Freight"
                  value={formData.freightType}
                  onChange={handleChange}
                  onBlur={() => handleBlur('freightType')}
                  error={errors.freightType}
                  icon="🚚"
                />
                <Input
                  label="Weight"
                  name="weight"
                  placeholder="10kg"
                  value={formData.weight}
                  onChange={handleChange}
                  onBlur={() => handleBlur('weight')}
                  error={errors.weight}
                  icon="⚖️"
                />
              </div>
              
              <Input
                label="Dimensions"
                name="dimensions"
                placeholder="120cm x 80cm x 60cm"
                value={formData.dimensions}
                onChange={handleChange}
                error={errors.dimensions}
                icon="📏"
                hint="Optional - Format: L x W x H in cm"
              />
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-8 text-[#1E293B] flex items-center gap-2">
                <span className="w-1 h-6 bg-[#F97316] rounded-full"></span>
                Contact Information
              </h3>

              <Input
                label="Full Name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                onBlur={() => handleBlur('name')}
                error={errors.name}
                icon="👤"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                  error={errors.email}
                  icon="📧"
                />
                <Input
                  label="Phone"
                  name="phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={() => handleBlur('phone')}
                  error={errors.phone}
                  icon="📞"
                />
              </div>
              
              <Input
                label="Company"
                name="company"
                placeholder="Company Name (Optional)"
                value={formData.company}
                onChange={handleChange}
                icon="🏢"
              />
              
              <Input
                label="Address"
                name="address"
                placeholder="Street, City, Zip Code"
                value={formData.address}
                onChange={handleChange}
                onBlur={() => handleBlur('address')}
                error={errors.address}
                icon="🏠"
              />
            </div>
          </div>

          {/* Special Instructions */}
          <div className="mt-10 relative z-10">
            <label className="block text-sm text-[#475569] mb-2 flex items-center gap-2">
              <span>📝</span> Special Instructions (Optional)
            </label>
            <textarea
              name="instructions"
              rows={4}
              placeholder="Any special requirements..."
              value={formData.instructions}
              onChange={handleChange}
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 rounded-xl px-5 py-4 outline-none transition-all duration-300 hover:border-[#F97316]/50 text-[#1E293B] placeholder-[#94A3B8] resize-none"
            />
          </div>

          {/* Terms */}
          <div className="mt-6 relative z-10">
            <div className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="w-5 h-5 accent-[#F97316] rounded border-[#CBD5E1] bg-white focus:ring-[#F97316]"
              />
              <span className="text-[#475569]">
                I agree to the <span className="text-[#F97316] hover:text-[#FB923C] hover:underline cursor-pointer transition-colors">Terms & Conditions</span> and <span className="text-[#F97316] hover:text-[#FB923C] hover:underline cursor-pointer transition-colors">Privacy Policy</span>.
              </span>
            </div>
            {errors.agreeToTerms && (
              <p className="mt-2 text-sm text-[#EF4444] flex items-center gap-1">
                <span>⚠️</span> {errors.agreeToTerms}
              </p>
            )}
          </div>

          {/* Button */}
          <div className="mt-10 text-center relative z-10">
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative group bg-gradient-to-r from-[#F97316] to-[#FB923C] text-white font-semibold px-12 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-[#F97316]/25 hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              <span className="flex items-center gap-3">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Request...
                  </>
                ) : (
                  <>
                    Send Your Request
                    <span className="group-hover:translate-x-2 transition-transform">→</span>
                  </>
                )}
              </span>
            </button>
          </div>

        </form>
      </div>
    </section>
  );
}

// Simple Input Component
function Input({ label, name, type = 'text', placeholder, value, onChange, onBlur, error, icon, hint }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm text-[#475569] mb-2 flex items-center gap-2">
        <span>{icon}</span> {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`
          w-full bg-white border rounded-xl px-4 py-3 outline-none transition-all duration-300 text-[#1E293B] placeholder-[#94A3B8]
          ${error 
            ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20' 
            : 'border-[#E2E8F0] focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20'
          }
          hover:border-[#F97316]/50
        `}
      />
      {error && (
        <p className="mt-2 text-sm text-[#EF4444] flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-2 text-xs text-[#64748B]">{hint}</p>
      )}
    </div>
  );
}