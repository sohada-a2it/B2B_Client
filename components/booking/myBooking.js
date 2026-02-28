// components/bookings/CustomerBookings.js
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  getMyBookings,
  getMyBookingById,
  getMyBookingTimeline,
  getMyBookingInvoices,
  getMyBookingQuote,
  getMyBookingsSummary,
  downloadBookingDocument,
  acceptQuote,
  rejectQuote,
  cancelBooking,
  getStatusDisplayText,
  getPricingStatusDisplayText,
  getShipmentTypeDisplay,
  getOriginDisplay,
  getDestinationDisplay,
  getShippingModeDisplay,
  formatDate,
  formatCurrency,
  isQuoteValid,
  getQuoteDaysRemaining,
  canCancelBooking,
  canRespondToQuote,
  calculateCargoTotals
} from '@/Api/booking';

// Icons
import {
  Package,
  Search,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  Plus,
  Calendar,
  MapPin,
  User,
  Truck,
  Ship,
  Plane,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Loader2,
  MoreVertical,
  X,
  Hash,
  DollarSign,
  ChevronsLeft,
  ChevronsRight,
  Phone,
  Mail,
  Activity,
  FileText,
  Home,
  Tag,
  Calendar as CalendarIcon,
  Copy,
  MessageSquare,
  Box,
  ArrowRight,
  ArrowLeft,
  Clock as ClockSolid,
  Info,
  ThumbsUp,
  ThumbsDown,
  Ban,
  Grid,
  List,
  ArrowUpDown,
  Receipt,
  AlertTriangle,
  CheckCircle as CheckCircleSolid,
  XCircle as XCircleSolid,
  TrendingUp
} from 'lucide-react';

// ==================== COLOR CONSTANTS ====================
const COLORS = {
  primary: '#E67E22',
  secondary: '#3C719D',
  primaryLight: '#fef2e6',
  secondaryLight: '#e8edf3',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  purple: '#8b5cf6',
  pink: '#ec4899',
  indigo: '#6366f1'
};

// ==================== STATUS CONFIGURATION ====================
const STATUS_CONFIG = {
  booking_requested: {
    label: 'Booking Requested',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Clock,
    progress: 10
  },
  price_quoted: {
    label: 'Price Quoted',
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    icon: Tag,
    progress: 30
  },
  booking_confirmed: {
    label: 'Booking Confirmed',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: CheckCircle,
    progress: 40
  },
  pickup_scheduled: {
    label: 'Pickup Scheduled',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: Calendar,
    progress: 50
  },
  received_at_warehouse: {
    label: 'Received at Warehouse',
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    icon: Package,
    progress: 60
  },
  consolidation_in_progress: {
    label: 'Consolidation in Progress',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Box,
    progress: 70
  },
  loaded_in_container: {
    label: 'Loaded in Container',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: Ship,
    progress: 75
  },
  loaded_on_flight: {
    label: 'Loaded on Flight',
    color: 'bg-sky-50 text-sky-700 border-sky-200',
    icon: Plane,
    progress: 75
  },
  in_transit: {
    label: 'In Transit',
    color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    icon: Truck,
    progress: 80
  },
  arrived_at_destination: {
    label: 'Arrived at Destination',
    color: 'bg-teal-50 text-teal-700 border-teal-200',
    icon: MapPin,
    progress: 85
  },
  customs_clearance: {
    label: 'Customs Clearance',
    color: 'bg-lime-50 text-lime-700 border-lime-200',
    icon: FileText,
    progress: 90
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    icon: Truck,
    progress: 95
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-green-50 text-green-700 border-green-200',
    icon: CheckCircleSolid,
    progress: 100
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-50 text-red-700 border-red-200',
    icon: XCircleSolid,
    progress: 0
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: AlertTriangle,
    progress: 0
  }
};

// ==================== SHIPMENT TYPE ICONS ====================
const SHIPMENT_TYPE_ICONS = {
  air_freight: Plane,
  sea_freight: Ship,
  express_courier: Package
};

const SHIPMENT_TYPE_COLORS = {
  air_freight: COLORS.primary,
  sea_freight: COLORS.secondary,
  express_courier: COLORS.success
};

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
  icon = null,
  iconPosition = 'left',
  fullWidth = false
}) => {
  const baseClasses = 'rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center';
  
  const variants = {
    primary: `bg-[#E67E22] text-white hover:bg-[#d35400] focus:ring-[#E67E22] shadow-sm`,
    secondary: `bg-[#3C719D] text-white hover:bg-[#2c5a8c] focus:ring-[#3C719D]`,
    outline: `border-2 border-[#E67E22] text-[#E67E22] hover:bg-[#fef2e6] focus:ring-[#E67E22]`,
    light: `bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500`,
    success: `bg-[#10b981] text-white hover:bg-[#0d9488] focus:ring-[#10b981]`,
    danger: `bg-[#ef4444] text-white hover:bg-[#dc2626] focus:ring-[#ef4444]`,
    warning: `bg-[#f59e0b] text-white hover:bg-[#d97706] focus:ring-[#f59e0b]`,
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500'
  };

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
    xl: 'px-6 py-3.5 text-base'
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${fullWidth ? 'w-full' : ''}`}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? (
        <div className="flex items-center">
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        <div className="flex items-center">
          {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
        </div>
      )}
    </button>
  );
};

// Input Component
const Input = ({
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  label,
  error,
  icon: Icon,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-4 w-4 text-gray-400" />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-3 py-2 text-sm border rounded-lg shadow-sm
            focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:border-transparent
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-300' : 'border-gray-300'}
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

// Select Component
const Select = ({
  name,
  value,
  onChange,
  options,
  placeholder = 'Select option',
  label,
  error,
  icon: Icon,
  required = false,
  disabled = false,
  className = ''
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-4 w-4 text-gray-400" />
          </div>
        )}
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full px-3 py-2 text-sm border rounded-lg shadow-sm appearance-none
            focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:border-transparent
            ${Icon ? 'pl-10' : 'pl-3'}
            pr-10
            ${error ? 'border-red-300' : 'border-gray-300'}
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}
            ${className}
          `}
        >
          <option value="">{placeholder}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status, size = 'md' }) => {
  const config = STATUS_CONFIG[status] || {
    label: getStatusDisplayText(status) || status,
    color: 'bg-gray-50 text-gray-700 border-gray-200',
    icon: Clock
  };
  
  const Icon = config.icon;
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium border ${config.color} ${sizes[size]}`}>
      <Icon className={`${size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} mr-1`} />
      {config.label}
    </span>
  );
};

// Pricing Status Badge
const PricingStatusBadge = ({ status }) => {
  const colors = {
    pending: 'bg-gray-50 text-gray-700 border-gray-200',
    quoted: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    accepted: 'bg-green-50 text-green-700 border-green-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
    expired: 'bg-gray-50 text-gray-700 border-gray-200'
  };

  const icons = {
    pending: Clock,
    quoted: Tag,
    accepted: CheckCircle,
    rejected: XCircle,
    expired: AlertCircle
  };

  const Icon = icons[status] || Clock;

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium border ${colors[status] || colors.pending}`}>
      <Icon className="h-3 w-3 mr-1" />
      {getPricingStatusDisplayText(status)}
    </span>
  );
};

// Shipment Type Badge
const ShipmentTypeBadge = ({ type }) => {
  const Icon = SHIPMENT_TYPE_ICONS[type] || Package;
  const color = SHIPMENT_TYPE_COLORS[type] || COLORS.secondary;
  
  return (
    <span 
      className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium"
      style={{ backgroundColor: `${color}15`, color: color }}
    >
      <Icon className="h-3.5 w-3.5 mr-1" />
      {getShipmentTypeDisplay(type)}
    </span>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, subtitle }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value || 0}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

// Booking Card Component
const BookingCard = ({ booking, onView, onAction }) => {
  const cargoTotals = calculateCargoTotals(booking.cargoDetails || []);
  const quoteValid = booking.quotedPrice ? isQuoteValid(booking.quotedPrice) : false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center">
              <h3 
                className="text-sm font-semibold cursor-pointer hover:underline text-[#E67E22]"
                onClick={() => onView(booking)}
              >
                #{booking.bookingNumber || booking._id?.slice(-8).toUpperCase()}
              </h3>
              {booking.trackingNumber && (
                <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {booking.trackingNumber}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {booking.customer?.companyName || 
               `${booking.customer?.firstName || ''} ${booking.customer?.lastName || ''}`.trim() || 
               'N/A'}
            </p>
          </div>
          <button
            onClick={() => onView(booking)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Route */}
        <div className="flex items-center text-xs mb-3 p-2 bg-gray-50 rounded-lg">
          <span className="font-medium text-gray-900">
            {getOriginDisplay(booking.shipmentDetails?.origin) || 'N/A'}
          </span>
          <ArrowRight className="h-3 w-3 mx-1 text-gray-400" />
          <span className="font-medium text-gray-900">
            {getDestinationDisplay(booking.shipmentDetails?.destination) || 'N/A'}
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <p className="text-xs text-gray-500">Type</p>
            <ShipmentTypeBadge type={booking.shipmentDetails?.shipmentType} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Created</p>
            <p className="text-xs font-medium">{formatDate(booking.createdAt, 'short')}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Cargo</p>
            <p className="text-xs font-medium">
              {cargoTotals.totalCartons} ctns • {cargoTotals.totalWeight.toFixed(1)} kg
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Quote</p>
            {booking.quotedPrice ? (
              <p className="text-xs font-medium text-green-600">
                {formatCurrency(booking.quotedPrice.amount, booking.quotedPrice.currency)}
              </p>
            ) : (
              <p className="text-xs text-gray-400">Pending</p>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between pt-2 border-t">
          <StatusBadge status={booking.status} size="sm" />
          <PricingStatusBadge status={booking.pricingStatus} />
        </div>

        {/* Quote Action (if applicable) */}
        {booking.pricingStatus === 'quoted' && quoteValid && booking.status === 'price_quoted' && (
          <div className="mt-3 flex space-x-2">
            <Button
              size="xs"
              variant="success"
              onClick={() => onAction('accept', booking)}
              icon={<ThumbsUp className="h-3 w-3" />}
              fullWidth
            >
              Accept
            </Button>
            <Button
              size="xs"
              variant="danger"
              onClick={() => onAction('reject', booking)}
              icon={<ThumbsDown className="h-3 w-3" />}
              fullWidth
            >
              Reject
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ==================== MODALS ====================

// Modal Component with blur overlay
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
   

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle ${sizes[size]} w-full`}
        >
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-white border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/80 rounded-lg transition-all hover:scale-110"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          {/* Content */}
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Accept/Reject Quote Modal
const QuoteResponseModal = ({ isOpen, onClose, booking, type, onRespond }) => {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !booking) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (type === 'reject' && !notes.trim()) {
      toast.warning('Please provide a reason for rejection');
      return;
    }
    
    setLoading(true);
    try {
      const result = type === 'accept' 
        ? await acceptQuote(booking._id, notes)
        : await rejectQuote(booking._id, notes);
      
      if (result.success) {
        toast.success(`Quote ${type}ed successfully!`);
        onClose(true);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(`Failed to ${type} quote`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)} title={type === 'accept' ? 'Accept Quote' : 'Reject Quote'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={`p-4 rounded-lg ${type === 'accept' ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex items-start">
            {type === 'accept' ? (
              <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className={`text-sm font-medium ${type === 'accept' ? 'text-green-800' : 'text-red-800'}`}>
                {type === 'accept' 
                  ? 'Are you sure you want to accept this quote?' 
                  : 'Are you sure you want to reject this quote?'}
              </p>
              {booking.quotedPrice && (
                <p className="text-xs text-gray-600 mt-1">
                  Amount: {formatCurrency(booking.quotedPrice.amount, booking.quotedPrice.currency)}
                </p>
              )}
            </div>
          </div>
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={type === 'accept' ? 'Add any notes (optional)...' : 'Please provide a reason for rejection...'}
          rows={3}
          className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
          required={type === 'reject'}
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onClose(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant={type === 'accept' ? 'success' : 'danger'}
            isLoading={loading}
            icon={type === 'accept' ? <ThumbsUp className="h-4 w-4" /> : <ThumbsDown className="h-4 w-4" />}
          >
            Yes, {type === 'accept' ? 'Accept' : 'Reject'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Cancel Booking Modal
const CancelModal = ({ isOpen, onClose, booking, onCancel }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !booking) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.warning('Please provide a cancellation reason');
      return;
    }
    setLoading(true);
    try {
      const result = await cancelBooking(booking._id, reason);
      if (result.success) {
        toast.success('Booking cancelled successfully!');
        onClose(true);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to cancel booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)} title="Cancel Booking" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Are you sure you want to cancel this booking?
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Please provide a reason for cancellation..."
          rows={3}
          className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
          required
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onClose(false)}
          >
            No, Keep Booking
          </Button>
          <Button
            type="submit"
            variant="danger"
            isLoading={loading}
            icon={<Ban className="h-4 w-4" />}
          >
            Yes, Cancel Booking
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Booking Details Modal
const BookingDetailsModal = ({ isOpen, onClose, booking }) => {
  const [activeTab, setActiveTab] = useState('details');
  
  if (!isOpen || !booking) return null;

  const cargoTotals = calculateCargoTotals(booking.cargoDetails || []);
  const quoteValid = booking.quotedPrice ? isQuoteValid(booking.quotedPrice) : false;
  const daysRemaining = booking.quotedPrice ? getQuoteDaysRemaining(booking.quotedPrice.validUntil) : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Booking Details" size="xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-xl font-semibold text-gray-900">
              #{booking.bookingNumber || booking._id?.slice(-8).toUpperCase()}
            </h4>
            <p className="text-sm text-gray-500 mt-1">
              Created on {formatDate(booking.createdAt, 'long')}
            </p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <StatusBadge status={booking.status} size="lg" />
            <PricingStatusBadge status={booking.pricingStatus} />
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 overflow-x-auto pb-1">
            {[
              { id: 'details', label: 'Details', icon: Package },
              { id: 'cargo', label: 'Cargo', icon: Box },
              { id: 'pricing', label: 'Pricing', icon: DollarSign }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors flex items-center whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#E67E22] text-[#E67E22]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[300px]">
          {activeTab === 'details' && (
            <div className="space-y-4">
              {/* Route */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-[#E67E22]" />
                  Route Information
                </h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Origin</p>
                    <p className="text-sm font-medium">{getOriginDisplay(booking.shipmentDetails?.origin) || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Destination</p>
                    <p className="text-sm font-medium">{getDestinationDisplay(booking.shipmentDetails?.destination) || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Shipment Type</p>
                    <ShipmentTypeBadge type={booking.shipmentDetails?.shipmentType} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Shipping Mode</p>
                    <p className="text-sm font-medium">{getShippingModeDisplay(booking.shipmentDetails?.shippingMode) || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Tracking */}
              {booking.trackingNumber && (
                <div className="border rounded-lg p-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <Hash className="h-4 w-4 mr-2 text-[#E67E22]" />
                    Tracking Information
                  </h5>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Tracking Number</p>
                      <p className="text-sm font-medium">{booking.trackingNumber}</p>
                    </div>
                    <Button
                      size="xs"
                      variant="light"
                      onClick={() => {
                        navigator.clipboard.writeText(booking.trackingNumber);
                        toast.success('Tracking number copied!');
                      }}
                      icon={<Copy className="h-3 w-3" />}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'cargo' && (
            <div className="space-y-4">
              {/* Cargo Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-xs text-gray-500">Total Cartons</p>
                  <p className="text-2xl font-semibold text-[#E67E22]">
                    {cargoTotals.totalCartons}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-xs text-gray-500">Total Weight (kg)</p>
                  <p className="text-2xl font-semibold text-[#3C719D]">
                    {cargoTotals.totalWeight.toFixed(1)}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-xs text-gray-500">Total Volume (cbm)</p>
                  <p className="text-2xl font-semibold text-green-600">
                    {cargoTotals.totalVolume.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Cargo Details Table */}
              {booking.cargoDetails && booking.cargoDetails.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Description</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Cartons</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Weight/Unit</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Volume/Unit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {booking.cargoDetails.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm">{item.description}</td>
                          <td className="px-4 py-2 text-sm">{item.cartons}</td>
                          <td className="px-4 py-2 text-sm">{item.weight} kg</td>
                          <td className="px-4 py-2 text-sm">{item.volume} cbm</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No cargo details available</p>
              )}
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-4">
              {booking.quotedPrice ? (
                <>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <p className="text-xs text-green-600 mb-1">Quoted Amount</p>
                    <p className="text-3xl font-bold text-green-600">
                      {formatCurrency(booking.quotedPrice.amount, booking.quotedPrice.currency)}
                    </p>
                    <div className="mt-2">
                      {quoteValid ? (
                        <span className="text-xs text-green-600">
                          Valid for {daysRemaining} more days
                        </span>
                      ) : (
                        <span className="text-xs text-red-600">Quote expired</span>
                      )}
                    </div>
                  </div>

                  {booking.quotedPrice.notes && (
                    <div className="border rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Notes</p>
                      <p className="text-sm">{booking.quotedPrice.notes}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No price quote available yet</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button
            variant="light"
            size="sm"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// ==================== MAIN COMPONENT ====================
export default function CustomerBookingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [summary, setSummary] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1
  });

  // Filter State
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    sort: '-createdAt'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Modal States
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Options
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    ...Object.entries(STATUS_CONFIG).map(([value, config]) => ({
      value,
      label: config.label
    }))
  ];

  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: '-updatedAt', label: 'Recently Updated' },
    { value: 'bookingNumber', label: 'Booking Number' }
  ];

  // Fetch Bookings
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await getMyBookings(filters);
      console.log('Bookings response:', response); // Debug log
      
      if (response.success) {
        setBookings(response.data || []);
        setPagination(response.pagination || {
          total: response.data?.length || 0,
          page: 1,
          limit: 10,
          pages: 1
        });
      } else {
        toast.error(response.message || 'Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Fetch bookings error:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Summary
  const fetchSummary = async () => {
    try {
      const response = await getMyBookingsSummary();
      console.log('Summary response:', response); // Debug log
      
      if (response.success) {
        setSummary(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch summary:', error);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchSummary();
  }, [filters.page, filters.limit, filters.sort]);

  // Handle Filter Change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  // Handle Search
  const handleSearch = () => {
    // Implement search logic if needed
  };

  // Clear Filters
  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      status: '',
      sort: '-createdAt'
    });
    setSearchTerm('');
    toast.info('Filters cleared');
  };

  // Handle View Booking
  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  // Handle Action
  const handleAction = (action, booking) => {
    setSelectedBooking(booking);
    
    switch (action) {
      case 'accept':
        setShowAcceptModal(true);
        break;
      case 'reject':
        setShowRejectModal(true);
        break;
      case 'cancel':
        setShowCancelModal(true);
        break;
      default:
        break;
    }
  };

  // After modal actions, refresh data
  const handleModalClose = (shouldRefresh = true) => {
    setShowAcceptModal(false);
    setShowRejectModal(false);
    setShowCancelModal(false);
    setShowDetailsModal(false);
    if (shouldRefresh) {
      fetchBookings();
      fetchSummary();
    }
  };

  // Calculate stats
  const totalBookings = bookings?.length || 0;
  const activeBookings = bookings?.filter(b => 
    !['delivered', 'cancelled', 'rejected'].includes(b.status)
  ).length || 0;
  const pendingQuotes = bookings?.filter(b => 
    b.pricingStatus === 'quoted' && b.status === 'price_quoted'
  ).length || 0;
  const delivered = bookings?.filter(b => b.status === 'delivered').length || 0;

  const stats = [
    { 
      title: 'Total Bookings', 
      value: totalBookings, 
      icon: Package, 
      color: 'bg-blue-100 text-blue-600' 
    },
    { 
      title: 'Active Bookings', 
      value: activeBookings, 
      icon: TrendingUp, 
      color: 'bg-green-100 text-green-600' 
    },
    { 
      title: 'Pending Quotes', 
      value: pendingQuotes, 
      icon: Clock, 
      color: 'bg-yellow-100 text-yellow-600' 
    },
    { 
      title: 'Delivered', 
      value: delivered, 
      icon: CheckCircleSolid, 
      color: 'bg-purple-100 text-purple-600' 
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-100">
                  <Package className="h-4 w-4 text-[#E67E22]" />
                </div>
                <h1 className="ml-2 text-lg font-semibold text-gray-900">My Shipments</h1>
              </div>
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                {totalBookings} Total
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* View Toggle */}
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'}`}
                >
                  <Grid className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'}`}
                >
                  <List className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push('/bookings/new')}
                icon={<Plus className="h-4 w-4" />}
              >
                New Booking
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="p-4">
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search by booking number or tracking number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  icon={Search}
                />
              </div>
              <Button
                variant={showFilters ? 'primary' : 'light'}
                size="md"
                onClick={() => setShowFilters(!showFilters)}
                icon={<Filter className="h-4 w-4" />}
              >
                Filters
                {(filters.status || filters.sort !== '-createdAt') && (
                  <span className="ml-2 bg-white text-[#E67E22] rounded-full px-2 py-0.5 text-xs">
                    {Object.values(filters).filter(v => v && v !== 10 && v !== '-createdAt').length}
                  </span>
                )}
              </Button>
              {(filters.status !== '' || filters.sort !== '-createdAt' || searchTerm) && (
                <Button
                  variant="light"
                  size="md"
                  onClick={clearFilters}
                  icon={<X className="h-4 w-4" />}
                >
                  Clear
                </Button>
              )}
              <Button
                variant="light"
                size="md"
                onClick={() => {
                  fetchBookings();
                  fetchSummary();
                }}
                icon={<RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />}
              />
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  options={statusOptions}
                  label="Status"
                  icon={Activity}
                />

                <Select
                  name="sort"
                  value={filters.sort}
                  onChange={handleFilterChange}
                  options={sortOptions}
                  label="Sort By"
                  icon={ArrowUpDown}
                />
              </div>
            )}
          </div>
        </div>

        {/* Bookings Grid/List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#E67E22]" />
            <span className="ml-2 text-sm text-gray-500">Loading your shipments...</span>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No shipments found</h3>
            <p className="text-sm text-gray-500 mb-6">You haven't created any shipments yet.</p>
            <Button
              variant="primary"
              onClick={() => router.push('/bookings/new')}
              icon={<Plus className="h-4 w-4" />}
            >
              Create Your First Shipment
            </Button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {bookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onView={handleViewBooking}
                  onAction={handleAction}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quote</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings.map((booking) => {
                  const quoteValid = booking.quotedPrice ? isQuoteValid(booking.quotedPrice) : false;
                  
                  return (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <div 
                            className="text-sm font-medium cursor-pointer hover:underline text-[#E67E22]"
                            onClick={() => handleViewBooking(booking)}
                          >
                            #{booking.bookingNumber || booking._id?.slice(-8).toUpperCase()}
                          </div>
                          {booking.trackingNumber && (
                            <div className="text-xs text-gray-500">{booking.trackingNumber}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center text-xs">
                          <span>{getOriginDisplay(booking.shipmentDetails?.origin) || 'N/A'}</span>
                          <ArrowRight className="h-3 w-3 mx-1 text-gray-400" />
                          <span>{getDestinationDisplay(booking.shipmentDetails?.destination) || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <ShipmentTypeBadge type={booking.shipmentDetails?.shipmentType} />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {formatDate(booking.createdAt, 'short')}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={booking.status} size="sm" />
                      </td>
                      <td className="px-4 py-3">
                        <PricingStatusBadge status={booking.pricingStatus} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewBooking(booking)}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4 text-gray-500" />
                          </button>
                          {booking.pricingStatus === 'quoted' && quoteValid && booking.status === 'price_quoted' && (
                            <>
                              <button
                                onClick={() => handleAction('accept', booking)}
                                className="p-1 hover:bg-green-100 rounded"
                                title="Accept Quote"
                              >
                                <ThumbsUp className="h-4 w-4 text-green-600" />
                              </button>
                              <button
                                onClick={() => handleAction('reject', booking)}
                                className="p-1 hover:bg-red-100 rounded"
                                title="Reject Quote"
                              >
                                <ThumbsDown className="h-4 w-4 text-red-600" />
                              </button>
                            </>
                          )}
                          {canCancelBooking(booking.status) && (
                            <button
                              onClick={() => handleAction('cancel', booking)}
                              className="p-1 hover:bg-red-100 rounded"
                              title="Cancel Booking"
                            >
                              <Ban className="h-4 w-4 text-red-500" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-xs text-gray-600">
                Showing {(pagination.page - 1) * filters.limit + 1} to{' '}
                {Math.min(pagination.page * filters.limit, pagination.total)} of{' '}
                {pagination.total} results
              </span>
              <Select
                name="limit"
                value={filters.limit}
                onChange={handleFilterChange}
                options={[
                  { value: 10, label: '10 / page' },
                  { value: 20, label: '20 / page' },
                  { value: 50, label: '50 / page' }
                ]}
                className="w-24"
              />
            </div>

            <div className="flex items-center space-x-1">
              <Button
                size="xs"
                variant="ghost"
                onClick={() => setFilters(prev => ({ ...prev, page: 1 }))}
                disabled={filters.page === 1}
                icon={<ChevronsLeft className="h-4 w-4" />}
              />
              <Button
                size="xs"
                variant="ghost"
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={filters.page === 1}
                icon={<ChevronLeft className="h-4 w-4" />}
              />
              
              <span className="text-sm text-gray-600 px-3">
                Page {filters.page} of {pagination.pages}
              </span>

              <Button
                size="xs"
                variant="ghost"
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={filters.page === pagination.pages}
                icon={<ChevronRight className="h-4 w-4" />}
              />
              <Button
                size="xs"
                variant="ghost"
                onClick={() => setFilters(prev => ({ ...prev, page: pagination.pages }))}
                disabled={filters.page === pagination.pages}
                icon={<ChevronsRight className="h-4 w-4" />}
              />
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <BookingDetailsModal
        isOpen={showDetailsModal}
        onClose={() => handleModalClose(false)}
        booking={selectedBooking}
      />

      <QuoteResponseModal
        isOpen={showAcceptModal}
        onClose={handleModalClose}
        booking={selectedBooking}
        type="accept"
      />

      <QuoteResponseModal
        isOpen={showRejectModal}
        onClose={handleModalClose}
        booking={selectedBooking}
        type="reject"
      />

      <CancelModal
        isOpen={showCancelModal}
        onClose={handleModalClose}
        booking={selectedBooking}
      />
    </div>
  );
}