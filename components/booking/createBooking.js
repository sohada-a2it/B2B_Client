// app/employee/create-booking/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { createBooking } from '@/Api/booking';

// Icons
import {
  Package, MapPin, Calendar, Weight, Box, FileText, ArrowLeft,
  Plus, Trash2, Send, AlertCircle, CheckCircle, ChevronRight,
  ChevronLeft, Truck, Ship, Plane, Phone, Mail, 
  DollarSign, Edit3, Building, Home, Clock,
  Globe, Hash, Tag, Briefcase, Loader2, X, 
  User, Save, Users, Shield, Copy, Download,
  Info
} from 'lucide-react';

// ==================== CONSTANTS (from bookingModel) ====================

const SHIPMENT_TYPES = {
  sea_freight: 'Sea Freight',
  air_freight: 'Air Freight',
  inland_trucking: 'Inland Trucking',
  multimodal: 'Multimodal'
};

const SHIPMENT_SUB_TYPES = {
  sea_freight_fcl: 'Sea Freight FCL',
  sea_freight_lcl: 'Sea Freight LCL',
  air_freight: 'Air Freight',
  rail_freight: 'Rail Freight',
  express_delivery: 'Express Delivery',
  inland_transport: 'Inland Transport',
  door_to_door: 'Door to Door'
};

const PACKAGING_TYPES = [
  'pallet', 'carton', 'crate', 'wooden_box', 'container',
  'envelope', 'loose_cargo', 'loose_tires', '20ft_container', '40ft_container'
];

const ORIGINS = ['China Warehouse', 'Thailand Warehouse'];

const DESTINATIONS = ['USA', 'UK', 'Canada'];

const SHIPPING_MODES = ['DDP', 'DDU', 'FOB', 'CIF'];

const PAYMENT_MODES = ['bank_transfer', 'credit_card', 'cash', 'wire_transfer'];

const COURIER_SERVICE_TYPES = ['standard', 'express', 'overnight', 'economy'];

const CURRENCIES = ['USD', 'GBP', 'CAD', 'THB', 'CNY', 'EUR', 'BDT'];

const PRODUCT_CATEGORIES = [
  'Electronics', 'Furniture', 'Clothing', 'Machinery', 
  'Automotive', 'Pharmaceuticals', 'Food', 'Documents',
  'Tires', 'Chemicals', 'Others'
];

const COURIER_COMPANIES = ['Cargo Logistics Group', 'DHL', 'FedEx', 'UPS', 'USPS', 'Other'];

// ==================== COMPONENTS ====================

// Button Component
const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
  icon: Icon,
  iconPosition = 'left'
}) => {
  const baseClasses = 'rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center';
  
  const variants = {
    primary: 'bg-[#2563eb] text-white hover:bg-[#1d4ed8] focus:ring-[#2563eb] shadow-sm',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400 border border-gray-300',
    outline: 'border border-[#2563eb] text-[#2563eb] hover:bg-blue-50 focus:ring-[#2563eb]',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500'
  };

  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2.5 text-base'
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? (
        <div className="flex items-center">
          <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
          <span>Please wait...</span>
        </div>
      ) : (
        <div className="flex items-center">
          {Icon && iconPosition === 'left' && <Icon className="h-3.5 w-3.5 mr-1.5" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="h-3.5 w-3.5 ml-1.5" />}
        </div>
      )}
    </button>
  );
};

// Input Component
const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className="block text-xs font-medium text-gray-600 mb-1">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <Icon className="h-3.5 w-3.5 text-gray-400" />
          </div>
        )}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-3 py-2 text-sm border rounded-md shadow-sm
            focus:outline-none focus:ring-1 focus:ring-[#2563eb] focus:border-[#2563eb]
            ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}
            ${Icon ? 'pl-8' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

// Select Component
const Select = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  options,
  error,
  required = false,
  icon: Icon,
  placeholder = 'Select...'
}) => {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className="block text-xs font-medium text-gray-600 mb-1">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <Icon className="h-3.5 w-3.5 text-gray-400" />
          </div>
        )}
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`
            w-full px-3 py-2 text-sm border rounded-md shadow-sm appearance-none
            focus:outline-none focus:ring-1 focus:ring-[#2563eb] focus:border-[#2563eb]
            ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}
            ${Icon ? 'pl-8' : ''}
          `}
        >
          <option value="">{placeholder}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
          <ChevronRight className="h-3.5 w-3.5 text-gray-400 transform rotate-90" />
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

// TextArea Component
const TextArea = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  rows = 3
}) => {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className="block text-xs font-medium text-gray-600 mb-1">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        rows={rows}
        className={`
          w-full px-3 py-2 text-sm border rounded-md shadow-sm
          focus:outline-none focus:ring-1 focus:ring-[#2563eb] focus:border-[#2563eb]
          ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}
        `}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

// Step Indicator
const StepIndicator = ({ step, currentStep, title }) => {
  const isActive = step <= currentStep;
  const isCurrent = step === currentStep;
  
  return (
    <div className="flex items-center">
      <div className={`
        w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all
        ${isCurrent ? 'bg-[#2563eb] text-white ring-2 ring-blue-200' : 
          isActive ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}
      `}>
        {isActive && step < currentStep ? <CheckCircle className="h-3 w-3" /> : step}
      </div>
      <span className={`ml-1.5 text-xs ${isCurrent ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
        {title}
      </span>
    </div>
  );
};

// Package Card Component
const PackageCard = ({ item, index, onChange, onRemove, errors }) => {
  return (
    <div className="border rounded-md p-3 bg-gray-50 relative">
      {index > 0 && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-0.5 hover:bg-red-200 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
      
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <Input
            label="Description"
            value={item.description}
            onChange={(e) => onChange(index, 'description', e.target.value)}
            placeholder="Product description"
            required
            icon={Package}
            error={errors[`package_desc_${index}`]}
          />
        </div>

        <Select
          label="Packaging Type"
          value={item.packagingType || 'carton'}
          onChange={(e) => onChange(index, 'packagingType', e.target.value)}
          options={PACKAGING_TYPES.map(type => ({ value: type, label: type.replace('_', ' ').toUpperCase() }))}
          icon={Box}
        />

        <Input
          label="Quantity"
          type="number"
          value={item.quantity}
          onChange={(e) => onChange(index, 'quantity', parseInt(e.target.value) || 1)}
          min="1"
          required
          icon={Package}
          error={errors[`package_qty_${index}`]}
        />

        <Input
          label="Weight (kg)"
          type="number"
          value={item.weight}
          onChange={(e) => onChange(index, 'weight', parseFloat(e.target.value) || 0)}
          min="0.1"
          step="0.1"
          required
          icon={Weight}
          error={errors[`package_weight_${index}`]}
        />

        <Input
          label="Volume (CBM)"
          type="number"
          value={item.volume}
          onChange={(e) => onChange(index, 'volume', parseFloat(e.target.value) || 0)}
          min="0.001"
          step="0.001"
          required
          icon={Box}
          error={errors[`package_volume_${index}`]}
        />

        <div className="col-span-2 grid grid-cols-2 gap-2">
          <Select
            label="Product Category"
            value={item.productCategory || ''}
            onChange={(e) => onChange(index, 'productCategory', e.target.value)}
            options={PRODUCT_CATEGORIES.map(cat => ({ value: cat, label: cat }))}
            icon={Tag}
            required
          />

          <Input
            label="HS Code"
            value={item.hsCode || ''}
            onChange={(e) => onChange(index, 'hsCode', e.target.value)}
            placeholder="Optional"
            icon={Hash}
          />
        </div>

        <div className="col-span-2 grid grid-cols-3 gap-2">
          <Input
            label="Value Amount"
            type="number"
            value={item.value?.amount || 0}
            onChange={(e) => onChange(index, 'value.amount', parseFloat(e.target.value) || 0)}
            icon={DollarSign}
            min="0"
            step="0.01"
          />

          <Select
            label="Currency"
            value={item.value?.currency || 'USD'}
            onChange={(e) => onChange(index, 'value.currency', e.target.value)}
            options={CURRENCIES.map(curr => ({ value: curr, label: curr }))}
          />

          <div className="flex items-center mt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={item.hazardous || false}
                onChange={(e) => onChange(index, 'hazardous', e.target.checked)}
                className="h-3.5 w-3.5 text-[#2563eb] focus:ring-[#2563eb] border-gray-300 rounded"
              />
              <span className="ml-1.5 text-xs text-gray-600">Hazardous</span>
            </label>
          </div>
        </div>

        <div className="col-span-2 grid grid-cols-2 gap-2">
          <Input
            label="Length (cm)"
            type="number"
            value={item.dimensions?.length || 0}
            onChange={(e) => onChange(index, 'dimensions.length', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.1"
          />

          <Input
            label="Width (cm)"
            type="number"
            value={item.dimensions?.width || 0}
            onChange={(e) => onChange(index, 'dimensions.width', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.1"
          />

          <Input
            label="Height (cm)"
            type="number"
            value={item.dimensions?.height || 0}
            onChange={(e) => onChange(index, 'dimensions.height', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.1"
          />

          <Select
            label="Unit"
            value={item.dimensions?.unit || 'cm'}
            onChange={(e) => onChange(index, 'dimensions.unit', e.target.value)}
            options={[
              { value: 'cm', label: 'cm' },
              { value: 'in', label: 'in' }
            ]}
          />
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

export default function EmployeeCreateBooking() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);
  const [employeeInfo, setEmployeeInfo] = useState(null);

  // Form Data State (matching bookingModel schema)
  const [formData, setFormData] = useState({
    // Shipment Classification
    shipmentClassification: {
      mainType: '',
      subType: ''
    },
    
    serviceType: 'standard',
    
    // Shipment Details
    shipmentDetails: {
      origin: '',
      destination: '',
      shippingMode: 'DDU',
      packageDetails: [{
        description: '',
        packagingType: 'carton',
        quantity: 1,
        weight: 0,
        volume: 0,
        dimensions: {
          length: 0,
          width: 0,
          height: 0,
          unit: 'cm'
        },
        productCategory: '',
        hsCode: '',
        value: {
          amount: 0,
          currency: 'USD'
        },
        hazardous: false
      }],
      specialInstructions: '',
      referenceNumber: ''
    },
    
    // Dates
    dates: {
      estimatedDeparture: '',
      estimatedArrival: ''
    },
    
    // Payment
    payment: {
      mode: 'bank_transfer',
      currency: 'USD'
    },
    
    // Sender Information
    sender: {
      name: '',
      companyName: '',
      email: '',
      phone: '',
      address: {
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: '',
        postalCode: ''
      },
      pickupInstructions: ''
    },
    
    // Receiver Information
    receiver: {
      name: '',
      companyName: '',
      email: '',
      phone: '',
      address: {
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: '',
        postalCode: ''
      },
      deliveryInstructions: '',
      isResidential: false
    },
    
    // Courier Information
    courier: {
      company: 'Cargo Logistics Group',
      serviceType: 'standard'
    }
  });

  // Errors State
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Load employee info
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.role === 'employee') {
      setEmployeeInfo(user);
    }
  }, []);

  // Calculate totals from package details
  useEffect(() => {
    if (formData.shipmentDetails.packageDetails.length > 0) {
      const totals = formData.shipmentDetails.packageDetails.reduce(
        (acc, item) => ({
          totalPackages: acc.totalPackages + (Number(item.quantity) || 0),
          totalWeight: acc.totalWeight + ((Number(item.weight) || 0) * (Number(item.quantity) || 0)),
          totalVolume: acc.totalVolume + ((Number(item.volume) || 0) * (Number(item.quantity) || 0))
        }),
        { totalPackages: 0, totalWeight: 0, totalVolume: 0 }
      );

      setFormData(prev => ({
        ...prev,
        shipmentDetails: {
          ...prev.shipmentDetails,
          totalPackages: totals.totalPackages,
          totalWeight: totals.totalWeight,
          totalVolume: totals.totalVolume
        }
      }));
    }
  }, [formData.shipmentDetails.packageDetails]);

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => {
      const keys = name.split('.');
      let current = { ...prev };
      let temp = current;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!temp[keys[i]]) temp[keys[i]] = {};
        temp = temp[keys[i]];
      }
      
      temp[keys[keys.length - 1]] = type === 'checkbox' ? checked : value;
      return current;
    });

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle Package Change
  const handlePackageChange = (index, field, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      const packageDetails = [...newData.shipmentDetails.packageDetails];
      
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        if (!packageDetails[index][parent]) packageDetails[index][parent] = {};
        packageDetails[index][parent][child] = value;
      } else {
        packageDetails[index][field] = value;
      }
      
      newData.shipmentDetails.packageDetails = packageDetails;
      return newData;
    });
  };

  // Add Package
  const addPackage = () => {
    setFormData(prev => ({
      ...prev,
      shipmentDetails: {
        ...prev.shipmentDetails,
        packageDetails: [
          ...prev.shipmentDetails.packageDetails,
          {
            description: '',
            packagingType: 'carton',
            quantity: 1,
            weight: 0,
            volume: 0,
            dimensions: {
              length: 0,
              width: 0,
              height: 0,
              unit: 'cm'
            },
            productCategory: '',
            hsCode: '',
            value: {
              amount: 0,
              currency: 'USD'
            },
            hazardous: false
          }
        ]
      }
    }));
  };

  // Remove Package
  const removePackage = (index) => {
    if (formData.shipmentDetails.packageDetails.length > 1) {
      setFormData(prev => ({
        ...prev,
        shipmentDetails: {
          ...prev.shipmentDetails,
          packageDetails: prev.shipmentDetails.packageDetails.filter((_, i) => i !== index)
        }
      }));
    }
  };

  // Copy Sender to Receiver
  const copySenderToReceiver = () => {
    setFormData(prev => ({
      ...prev,
      receiver: {
        ...prev.sender,
        deliveryInstructions: prev.receiver.deliveryInstructions,
        isResidential: prev.receiver.isResidential
      }
    }));
    toast.info('Sender information copied to receiver');
  };

  // Validate Form
  const validateForm = () => {
    const newErrors = {};

    // Step 1: Shipment Classification
    if (!formData.shipmentClassification.mainType) {
      newErrors['shipmentClassification.mainType'] = 'Main shipment type is required';
    }
    if (!formData.shipmentClassification.subType) {
      newErrors['shipmentClassification.subType'] = 'Shipment sub-type is required';
    }
    if (!formData.shipmentDetails.origin) {
      newErrors['shipmentDetails.origin'] = 'Origin is required';
    }
    if (!formData.shipmentDetails.destination) {
      newErrors['shipmentDetails.destination'] = 'Destination is required';
    }
    if (!formData.dates.estimatedDeparture) {
      newErrors['dates.estimatedDeparture'] = 'Estimated departure date is required';
    }
    if (!formData.dates.estimatedArrival) {
      newErrors['dates.estimatedArrival'] = 'Estimated arrival date is required';
    }

    // Check if arrival date is after departure
    if (formData.dates.estimatedDeparture && formData.dates.estimatedArrival) {
      if (new Date(formData.dates.estimatedArrival) < new Date(formData.dates.estimatedDeparture)) {
        newErrors['dates.estimatedArrival'] = 'Arrival date must be after departure date';
      }
    }

    // Step 2: Package Details
    formData.shipmentDetails.packageDetails.forEach((item, index) => {
      if (!item.description) {
        newErrors[`package_desc_${index}`] = 'Description is required';
      }
      if (!item.quantity || item.quantity < 1) {
        newErrors[`package_qty_${index}`] = 'Minimum 1 quantity required';
      }
      if (!item.weight || item.weight <= 0) {
        newErrors[`package_weight_${index}`] = 'Weight is required';
      }
      if (!item.volume || item.volume <= 0) {
        newErrors[`package_volume_${index}`] = 'Volume is required';
      }
      if (!item.productCategory) {
        newErrors[`package_category_${index}`] = 'Product category is required';
      }
    });

    // Step 3: Sender Information
    if (!formData.sender.name) {
      newErrors['sender.name'] = 'Sender name is required';
    }
    if (!formData.sender.email) {
      newErrors['sender.email'] = 'Sender email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.sender.email)) {
      newErrors['sender.email'] = 'Invalid email format';
    }
    if (!formData.sender.phone) {
      newErrors['sender.phone'] = 'Sender phone is required';
    }
    if (!formData.sender.address.addressLine1) {
      newErrors['sender.address.addressLine1'] = 'Address is required';
    }
    if (!formData.sender.address.city) {
      newErrors['sender.address.city'] = 'City is required';
    }
    if (!formData.sender.address.country) {
      newErrors['sender.address.country'] = 'Country is required';
    }

    // Step 4: Receiver Information
    if (!formData.receiver.name) {
      newErrors['receiver.name'] = 'Receiver name is required';
    }
    if (!formData.receiver.email) {
      newErrors['receiver.email'] = 'Receiver email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.receiver.email)) {
      newErrors['receiver.email'] = 'Invalid email format';
    }
    if (!formData.receiver.phone) {
      newErrors['receiver.phone'] = 'Receiver phone is required';
    }
    if (!formData.receiver.address.addressLine1) {
      newErrors['receiver.address.addressLine1'] = 'Address is required';
    }
    if (!formData.receiver.address.city) {
      newErrors['receiver.address.city'] = 'City is required';
    }
    if (!formData.receiver.address.country) {
      newErrors['receiver.address.country'] = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (currentStep !== 5) {
      return;
    }

    if (!validateForm()) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    setServerErrors([]);

    try {
      // Get current user from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Prepare data for API (matching backend schema)
      const bookingData = {
        customer: user._id, // Employee is creating booking, so customer is the employee
        createdBy: user._id,
        
        shipmentClassification: formData.shipmentClassification,
        serviceType: formData.serviceType,
        
        shipmentDetails: {
          ...formData.shipmentDetails,
          // totals will be calculated by backend pre-save middleware
        },
        
        dates: {
          requested: new Date(),
          estimatedDeparture: formData.dates.estimatedDeparture,
          estimatedArrival: formData.dates.estimatedArrival
        },
        
        payment: formData.payment,
        
        sender: formData.sender,
        receiver: formData.receiver,
        
        courier: formData.courier,
        
        status: 'booking_requested',
        pricingStatus: 'pending',
        
        timeline: [{
          status: 'booking_requested',
          description: 'Booking created by employee',
          updatedBy: user._id,
          timestamp: new Date()
        }]
      };

      const response = await createBooking(bookingData);
      
      if (response.success) {
        setShowSuccess(true);
        toast.success('Booking created successfully!');
        
        // Clear draft from localStorage
        localStorage.removeItem('employee_booking_draft');
        
        setTimeout(() => {
          router.push('/Bookings/my_bookings');
        }, 2000);
      } else {
        setServerErrors([{ msg: response.message || 'Failed to create booking' }]);
        toast.error(response.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error:', error);
      setServerErrors([{ msg: error.message || 'Network error' }]);
      toast.error(error.message || 'Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Next Step
  const nextStep = () => {
    let isValid = true;
    
    if (currentStep === 1) {
      if (!formData.shipmentClassification.mainType || 
          !formData.shipmentClassification.subType ||
          !formData.shipmentDetails.origin || 
          !formData.shipmentDetails.destination ||
          !formData.dates.estimatedDeparture ||
          !formData.dates.estimatedArrival) {
        isValid = false;
        toast.error('Please complete all required fields in step 1');
      }
    } else if (currentStep === 2) {
      const hasInvalidPackage = formData.shipmentDetails.packageDetails.some(
        item => !item.description || !item.quantity || !item.weight || !item.volume || !item.productCategory
      );
      if (hasInvalidPackage) {
        isValid = false;
        toast.error('Please complete all package details');
      }
    } else if (currentStep === 3) {
      if (!formData.sender.name ||
          !formData.sender.email ||
          !formData.sender.phone ||
          !formData.sender.address.addressLine1 ||
          !formData.sender.address.city ||
          !formData.sender.address.country) {
        isValid = false;
        toast.error('Please complete all required sender fields');
      }
    } else if (currentStep === 4) {
      if (!formData.receiver.name ||
          !formData.receiver.email ||
          !formData.receiver.phone ||
          !formData.receiver.address.addressLine1 ||
          !formData.receiver.address.city ||
          !formData.receiver.address.country) {
        isValid = false;
        toast.error('Please complete all required receiver fields');
      }
    }

    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Save as Draft
  const saveAsDraft = () => {
    const draftData = {
      ...formData,
      savedAt: new Date().toISOString()
    };
    
    localStorage.setItem('employee_booking_draft', JSON.stringify(draftData));
    toast.info('Draft saved successfully!');
  };

  // Load Draft
  useEffect(() => {
    const savedDraft = localStorage.getItem('employee_booking_draft');
    if (savedDraft) {
      const shouldLoad = window.confirm('Found a saved draft. Would you like to load it?');
      if (shouldLoad) {
        setFormData(JSON.parse(savedDraft));
        toast.success('Draft loaded successfully');
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-4">
              <Link 
                href="/employee/bookings"
                className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ArrowLeft className="h-4 w-4 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-base font-semibold text-gray-900 flex items-center">
                  <Users className="h-4 w-4 mr-1.5 text-[#2563eb]" />
                  Create Booking (Employee)
                </h1>
                <p className="text-xs text-gray-500">Create booking on behalf of customer</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {employeeInfo && (
                <div className="flex items-center text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
                  <Shield className="h-3 w-3 mr-1" />
                  {employeeInfo.firstName} {employeeInfo.lastName}
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={saveAsDraft}
                icon={Save}
              >
                Save Draft
              </Button>
              <span className="text-xs text-gray-500">
                Step {currentStep}/5
              </span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div
                    key={step}
                    className={`h-1 w-6 rounded-full transition-colors ${
                      step <= currentStep ? 'bg-[#2563eb]' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {serverErrors.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3">
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <div className="flex items-start">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="ml-2 flex-1">
                <p className="text-xs font-medium text-red-800">Error creating booking</p>
                {serverErrors.map((error, index) => (
                  <p key={index} className="text-xs text-red-600">{error.msg}</p>
                ))}
              </div>
              <button onClick={() => setServerErrors([])} className="flex-shrink-0">
                <X className="h-4 w-4 text-red-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 animate-fadeIn">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">Success!</h3>
              <p className="text-sm text-gray-500 mb-4">Booking created successfully</p>
              <div className="text-xs text-gray-400">Redirecting to bookings...</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border shadow-sm">
          {/* Step Indicators */}
          <div className="border-b px-4 py-2 bg-gray-50 rounded-t-lg">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              <StepIndicator step={1} currentStep={currentStep} title="Shipment" />
              <ChevronRight className="h-3 w-3 text-gray-400" />
              <StepIndicator step={2} currentStep={currentStep} title="Packages" />
              <ChevronRight className="h-3 w-3 text-gray-400" />
              <StepIndicator step={3} currentStep={currentStep} title="Sender" />
              <ChevronRight className="h-3 w-3 text-gray-400" />
              <StepIndicator step={4} currentStep={currentStep} title="Receiver" />
              <ChevronRight className="h-3 w-3 text-gray-400" />
              <StepIndicator step={5} currentStep={currentStep} title="Review" />
            </div>
          </div>

          {/* Form Content */}
          <div className="p-4">
            {/* Step 1: Shipment Classification */}
            {currentStep === 1 && (
              <div className="space-y-3 animate-fadeIn">
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Package className="h-4 w-4 mr-1 text-[#2563eb]" />
                  Shipment Classification
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <Select
                    label="Main Shipment Type"
                    name="shipmentClassification.mainType"
                    value={formData.shipmentClassification.mainType}
                    onChange={handleInputChange}
                    options={Object.entries(SHIPMENT_TYPES).map(([value, label]) => ({ value, label }))}
                    required
                    icon={Truck}
                    error={errors['shipmentClassification.mainType']}
                  />
                  
                  <Select
                    label="Shipment Sub-Type"
                    name="shipmentClassification.subType"
                    value={formData.shipmentClassification.subType}
                    onChange={handleInputChange}
                    options={Object.entries(SHIPMENT_SUB_TYPES).map(([value, label]) => ({ value, label }))}
                    required
                    icon={Package}
                    error={errors['shipmentClassification.subType']}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Select
                    label="Service Type"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    options={COURIER_SERVICE_TYPES.map(type => ({ value: type, label: type.toUpperCase() }))}
                    icon={Briefcase}
                  />
                  
                  <Select
                    label="Shipping Mode"
                    name="shipmentDetails.shippingMode"
                    value={formData.shipmentDetails.shippingMode}
                    onChange={handleInputChange}
                    options={SHIPPING_MODES.map(mode => ({ value: mode, label: mode }))}
                    icon={Globe}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Select
                    label="Origin"
                    name="shipmentDetails.origin"
                    value={formData.shipmentDetails.origin}
                    onChange={handleInputChange}
                    options={ORIGINS.map(origin => ({ value: origin, label: origin }))}
                    required
                    icon={MapPin}
                    error={errors['shipmentDetails.origin']}
                  />
                  
                  <Select
                    label="Destination"
                    name="shipmentDetails.destination"
                    value={formData.shipmentDetails.destination}
                    onChange={handleInputChange}
                    options={DESTINATIONS.map(dest => ({ value: dest, label: dest }))}
                    required
                    icon={Globe}
                    error={errors['shipmentDetails.destination']}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Estimated Departure"
                    type="date"
                    name="dates.estimatedDeparture"
                    value={formData.dates.estimatedDeparture}
                    onChange={handleInputChange}
                    required
                    icon={Calendar}
                    error={errors['dates.estimatedDeparture']}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  
                  <Input
                    label="Estimated Arrival"
                    type="date"
                    name="dates.estimatedArrival"
                    value={formData.dates.estimatedArrival}
                    onChange={handleInputChange}
                    required
                    icon={Calendar}
                    error={errors['dates.estimatedArrival']}
                    min={formData.dates.estimatedDeparture || new Date().toISOString().split('T')[0]}
                  />
                </div>

                <Input
                  label="Reference Number"
                  name="shipmentDetails.referenceNumber"
                  value={formData.shipmentDetails.referenceNumber}
                  onChange={handleInputChange}
                  placeholder="Customer reference (optional)"
                  icon={Hash}
                />

                <Select
                  label="Payment Mode"
                  name="payment.mode"
                  value={formData.payment.mode}
                  onChange={handleInputChange}
                  options={PAYMENT_MODES.map(mode => ({ 
                    value: mode, 
                    label: mode.replace('_', ' ').toUpperCase() 
                  }))}
                  icon={DollarSign}
                />

                <div className="bg-blue-50 rounded-md p-2">
                  <div className="flex items-start">
                    <Info className="h-3.5 w-3.5 text-blue-500 mt-0.5 mr-1.5 flex-shrink-0" />
                    <p className="text-xs text-blue-700">
                      Select the shipment type and origin/destination details
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Package Details */}
            {currentStep === 2 && (
              <div className="space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center">
                    <Box className="h-4 w-4 mr-1 text-[#2563eb]" />
                    Package Details
                  </h3>
                  <span className="text-xs text-gray-500">
                    {formData.shipmentDetails.packageDetails.length} package(s)
                  </span>
                </div>

                {formData.shipmentDetails.packageDetails.map((item, index) => (
                  <PackageCard
                    key={index}
                    item={item}
                    index={index}
                    onChange={handlePackageChange}
                    onRemove={removePackage}
                    errors={errors}
                  />
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPackage}
                  icon={Plus}
                  className="w-full"
                >
                  Add Another Package
                </Button>

                {formData.shipmentDetails.packageDetails.length > 0 && (
                  <div className="bg-blue-50 rounded-md p-3">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-xs text-gray-500">Total Packages</div>
                        <div className="text-sm font-semibold text-[#2563eb]">
                          {formData.shipmentDetails.totalPackages || 0}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Total Weight</div>
                        <div className="text-sm font-semibold text-[#2563eb]">
                          {(formData.shipmentDetails.totalWeight || 0).toFixed(1)} kg
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Total Volume</div>
                        <div className="text-sm font-semibold text-[#2563eb]">
                          {(formData.shipmentDetails.totalVolume || 0).toFixed(3)} CBM
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <TextArea
                  label="Special Instructions"
                  name="shipmentDetails.specialInstructions"
                  value={formData.shipmentDetails.specialInstructions}
                  onChange={handleInputChange}
                  placeholder="Any special handling instructions..."
                  rows={2}
                />
              </div>
            )}

            {/* Step 3: Sender Information */}
            {currentStep === 3 && (
              <div className="space-y-3 animate-fadeIn">
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <User className="h-4 w-4 mr-1 text-[#2563eb]" />
                  Sender Information
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Full Name"
                    name="sender.name"
                    value={formData.sender.name}
                    onChange={handleInputChange}
                    required
                    icon={User}
                    error={errors['sender.name']}
                  />

                  <Input
                    label="Company Name"
                    name="sender.companyName"
                    value={formData.sender.companyName}
                    onChange={handleInputChange}
                    icon={Building}
                  />

                  <Input
                    label="Email"
                    type="email"
                    name="sender.email"
                    value={formData.sender.email}
                    onChange={handleInputChange}
                    required
                    icon={Mail}
                    error={errors['sender.email']}
                  />

                  <Input
                    label="Phone"
                    name="sender.phone"
                    value={formData.sender.phone}
                    onChange={handleInputChange}
                    required
                    icon={Phone}
                    error={errors['sender.phone']}
                  />

                  <div className="col-span-2">
                    <Input
                      label="Address Line 1"
                      name="sender.address.addressLine1"
                      value={formData.sender.address.addressLine1}
                      onChange={handleInputChange}
                      required
                      icon={MapPin}
                      error={errors['sender.address.addressLine1']}
                    />
                  </div>

                  <div className="col-span-2">
                    <Input
                      label="Address Line 2"
                      name="sender.address.addressLine2"
                      value={formData.sender.address.addressLine2}
                      onChange={handleInputChange}
                      icon={MapPin}
                    />
                  </div>

                  <Input
                    label="City"
                    name="sender.address.city"
                    value={formData.sender.address.city}
                    onChange={handleInputChange}
                    required
                    error={errors['sender.address.city']}
                  />

                  <Input
                    label="State/Province"
                    name="sender.address.state"
                    value={formData.sender.address.state}
                    onChange={handleInputChange}
                  />

                  <Input
                    label="Country"
                    name="sender.address.country"
                    value={formData.sender.address.country}
                    onChange={handleInputChange}
                    required
                    error={errors['sender.address.country']}
                  />

                  <Input
                    label="Postal Code"
                    name="sender.address.postalCode"
                    value={formData.sender.address.postalCode}
                    onChange={handleInputChange}
                  />
                </div>

                <TextArea
                  label="Pickup Instructions"
                  name="sender.pickupInstructions"
                  value={formData.sender.pickupInstructions}
                  onChange={handleInputChange}
                  placeholder="Special pickup instructions..."
                  rows={2}
                />
              </div>
            )}

            {/* Step 4: Receiver Information */}
            {currentStep === 4 && (
              <div className="space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center">
                    <Users className="h-4 w-4 mr-1 text-[#2563eb]" />
                    Receiver Information
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copySenderToReceiver}
                    icon={Copy}
                  >
                    Copy from Sender
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Full Name"
                    name="receiver.name"
                    value={formData.receiver.name}
                    onChange={handleInputChange}
                    required
                    icon={User}
                    error={errors['receiver.name']}
                  />

                  <Input
                    label="Company Name"
                    name="receiver.companyName"
                    value={formData.receiver.companyName}
                    onChange={handleInputChange}
                    icon={Building}
                  />

                  <Input
                    label="Email"
                    type="email"
                    name="receiver.email"
                    value={formData.receiver.email}
                    onChange={handleInputChange}
                    required
                    icon={Mail}
                    error={errors['receiver.email']}
                  />

                  <Input
                    label="Phone"
                    name="receiver.phone"
                    value={formData.receiver.phone}
                    onChange={handleInputChange}
                    required
                    icon={Phone}
                    error={errors['receiver.phone']}
                  />

                  <div className="col-span-2">
                    <Input
                      label="Address Line 1"
                      name="receiver.address.addressLine1"
                      value={formData.receiver.address.addressLine1}
                      onChange={handleInputChange}
                      required
                      icon={MapPin}
                      error={errors['receiver.address.addressLine1']}
                    />
                  </div>

                  <div className="col-span-2">
                    <Input
                      label="Address Line 2"
                      name="receiver.address.addressLine2"
                      value={formData.receiver.address.addressLine2}
                      onChange={handleInputChange}
                      icon={MapPin}
                    />
                  </div>

                  <Input
                    label="City"
                    name="receiver.address.city"
                    value={formData.receiver.address.city}
                    onChange={handleInputChange}
                    required
                    error={errors['receiver.address.city']}
                  />

                  <Input
                    label="State/Province"
                    name="receiver.address.state"
                    value={formData.receiver.address.state}
                    onChange={handleInputChange}
                  />

                  <Input
                    label="Country"
                    name="receiver.address.country"
                    value={formData.receiver.address.country}
                    onChange={handleInputChange}
                    required
                    error={errors['receiver.address.country']}
                  />

                  <Input
                    label="Postal Code"
                    name="receiver.address.postalCode"
                    value={formData.receiver.address.postalCode}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isResidential"
                    name="receiver.isResidential"
                    checked={formData.receiver.isResidential}
                    onChange={handleInputChange}
                    className="h-3.5 w-3.5 text-[#2563eb] focus:ring-[#2563eb] border-gray-300 rounded"
                  />
                  <label htmlFor="isResidential" className="ml-2 text-xs text-gray-600">
                    This is a residential address
                  </label>
                </div>

                <TextArea
                  label="Delivery Instructions"
                  name="receiver.deliveryInstructions"
                  value={formData.receiver.deliveryInstructions}
                  onChange={handleInputChange}
                  placeholder="Special delivery instructions..."
                  rows={2}
                />
              </div>
            )}

            {/* Step 5: Review & Submit */}
            {currentStep === 5 && (
              <div className="space-y-3 animate-fadeIn">
                {/* Shipment Overview */}
                <div className="bg-gray-50 rounded-md p-3">
                  <h3 className="text-xs font-medium text-gray-700 mb-2 flex items-center">
                    <Package className="h-3.5 w-3.5 mr-1 text-[#2563eb]" />
                    Shipment Overview
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Main Type:</span>{' '}
                      <span className="font-medium">
                        {SHIPMENT_TYPES[formData.shipmentClassification.mainType] || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Sub-Type:</span>{' '}
                      <span className="font-medium">
                        {SHIPMENT_SUB_TYPES[formData.shipmentClassification.subType] || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Service:</span>{' '}
                      <span className="font-medium">{formData.serviceType.toUpperCase()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Mode:</span>{' '}
                      <span className="font-medium">{formData.shipmentDetails.shippingMode}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Origin:</span>{' '}
                      <span className="font-medium">{formData.shipmentDetails.origin}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Destination:</span>{' '}
                      <span className="font-medium">{formData.shipmentDetails.destination}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Departure:</span>{' '}
                      <span className="font-medium">
                        {new Date(formData.dates.estimatedDeparture).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Arrival:</span>{' '}
                      <span className="font-medium">
                        {new Date(formData.dates.estimatedArrival).toLocaleDateString()}
                      </span>
                    </div>
                    {formData.shipmentDetails.referenceNumber && (
                      <div className="col-span-2">
                        <span className="text-gray-500">Reference:</span>{' '}
                        <span className="font-medium">{formData.shipmentDetails.referenceNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Packages Summary */}
                <div className="bg-gray-50 rounded-md p-3">
                  <h3 className="text-xs font-medium text-gray-700 mb-2 flex items-center">
                    <Box className="h-3.5 w-3.5 mr-1 text-[#2563eb]" />
                    Packages Summary
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {formData.shipmentDetails.packageDetails.map((item, index) => (
                      <div key={index} className="text-xs border-b last:border-0 pb-1 last:pb-0">
                        <div className="font-medium">{item.description}</div>
                        <div className="text-gray-500 flex justify-between">
                          <span>
                            {item.quantity} × {item.packagingType} | 
                            {item.weight} kg | {item.volume} CBM
                          </span>
                          {item.value.amount > 0 && (
                            <span className="font-medium">
                              {item.value.currency} {item.value.amount.toLocaleString()}
                            </span>
                          )}
                        </div>
                        {item.hazardous && (
                          <span className="text-xs text-red-500">⚠️ Hazardous Material</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Total Packages:</span>{' '}
                      <span className="font-medium">{formData.shipmentDetails.totalPackages || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Total Weight:</span>{' '}
                      <span className="font-medium">
                        {(formData.shipmentDetails.totalWeight || 0).toFixed(1)} kg
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Total Volume:</span>{' '}
                      <span className="font-medium">
                        {(formData.shipmentDetails.totalVolume || 0).toFixed(3)} CBM
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sender & Receiver Summary */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 rounded-md p-2">
                    <h3 className="text-xs font-medium text-gray-700 mb-1 flex items-center">
                      <User className="h-3 w-3 mr-1 text-[#2563eb]" />
                      Sender
                    </h3>
                    <div className="text-xs">
                      <p className="font-medium">{formData.sender.name}</p>
                      {formData.sender.companyName && (
                        <p className="text-gray-600">{formData.sender.companyName}</p>
                      )}
                      <p className="text-gray-600">{formData.sender.email}</p>
                      <p className="text-gray-600">{formData.sender.phone}</p>
                      <p className="text-gray-600 mt-1">
                        {formData.sender.address.addressLine1}<br />
                        {formData.sender.address.city}, {formData.sender.address.country}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-md p-2">
                    <h3 className="text-xs font-medium text-gray-700 mb-1 flex items-center">
                      <Users className="h-3 w-3 mr-1 text-[#2563eb]" />
                      Receiver
                    </h3>
                    <div className="text-xs">
                      <p className="font-medium">{formData.receiver.name}</p>
                      {formData.receiver.companyName && (
                        <p className="text-gray-600">{formData.receiver.companyName}</p>
                      )}
                      <p className="text-gray-600">{formData.receiver.email}</p>
                      <p className="text-gray-600">{formData.receiver.phone}</p>
                      <p className="text-gray-600 mt-1">
                        {formData.receiver.address.addressLine1}<br />
                        {formData.receiver.address.city}, {formData.receiver.address.country}
                      </p>
                      {formData.receiver.isResidential && (
                        <p className="text-xs text-blue-600 mt-1">🏠 Residential</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Special Instructions */}
                {(formData.shipmentDetails.specialInstructions || 
                  formData.sender.pickupInstructions || 
                  formData.receiver.deliveryInstructions) && (
                  <div className="bg-gray-50 rounded-md p-2">
                    <h3 className="text-xs font-medium text-gray-700 mb-1">Special Instructions</h3>
                    {formData.shipmentDetails.specialInstructions && (
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Shipment:</span> {formData.shipmentDetails.specialInstructions}
                      </p>
                    )}
                    {formData.sender.pickupInstructions && (
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Pickup:</span> {formData.sender.pickupInstructions}
                      </p>
                    )}
                    {formData.receiver.deliveryInstructions && (
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Delivery:</span> {formData.receiver.deliveryInstructions}
                      </p>
                    )}
                  </div>
                )}

                <div className="bg-green-50 rounded-md p-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1.5" />
                    <p className="text-xs text-green-700">
                      Please review all information before submitting. Booking will be created with status "booking_requested".
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-4 pt-3 border-t">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={prevStep}
                  icon={ChevronLeft}
                >
                  Back
                </Button>
              ) : (
                <div></div>
              )}

              {currentStep < 5 ? (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={nextStep}
                  icon={ChevronRight}
                  iconPosition="right"
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="success"
                  size="sm"
                  isLoading={isSubmitting}
                  icon={Send}
                >
                  Create Booking
                </Button>
              )}
            </div>
          </div>
        </form>

        {/* Progress Summary */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            {currentStep === 1 && "📦 Step 1: Select shipment type and route"}
            {currentStep === 2 && "📦 Step 2: Add package details"}
            {currentStep === 3 && "📦 Step 3: Enter sender information"}
            {currentStep === 4 && "📦 Step 4: Enter receiver information"}
            {currentStep === 5 && "📦 Step 5: Review and submit booking"}
          </p>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}