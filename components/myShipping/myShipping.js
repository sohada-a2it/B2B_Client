// components/shipments/ShipmentsPage.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import {
  // Main APIs
  getAllShipments,
  getShipmentById,
  getMyShipments,
  getMyShipmentById,
  getMyShipmentTimeline,
  getShipmentStatistics,
  getShipmentTimeline,
  trackShipmentByNumber,
  
  // Helper functions
  getShipmentStatusColor,
  getShipmentStatusDisplayText,
  getShipmentModeDisplay,
  getShipmentProgress,
  isShipmentActive,
  formatShipmentDate,
  formatShipmentCurrency,
  formatWeight,
  formatVolume,
  calculateTotalWeight,
  calculateTotalVolume,
  isOnTrack,
  getDaysInTransit,
  getShipmentSummary,
  groupShipmentsByStatus,
  groupShipmentsByMode,
  getTopRoutes,
  exportShipmentsToCSV
} from '@/Api/shipping';

// Icons
import {
  Package, Search, Filter, ChevronDown, ChevronLeft, ChevronRight,
  Eye, Download, Plus, Calendar, MapPin, User,
  Truck, Ship, Plane, Clock, CheckCircle, XCircle,
  AlertCircle, RefreshCw, Loader2, MoreVertical,
  ArrowUpDown, Download as ExportIcon, Filter as FilterIcon,
  X, Globe, Hash, DollarSign,
  ChevronsLeft, ChevronsRight,
  Home, Briefcase, Tag, Calendar as CalendarIcon,
  FileText, Box, Activity, Navigation,
  CheckCircle as CheckCircleSolid,
  XCircle as XCircleSolid, Clock as ClockSolid,
  TrendingUp, PieChart, BarChart3,
  Train
} from 'lucide-react';

// ==================== COLOR CONSTANTS ====================
const COLORS = {
  primary: '#E67E22',
  secondary: '#3C719D',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  purple: '#8b5cf6',
  orange: '#f97316'
};

// ==================== STATUS CONFIGURATION ====================
const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    icon: Clock,
    progress: 10
  },
  received_at_warehouse: {
    label: 'Received at Warehouse',
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    icon: Package,
    progress: 25
  },
  consolidation_in_progress: {
    label: 'Consolidation',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Box,
    progress: 35
  },
  ready_for_shipping: {
    label: 'Ready for Shipping',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: CheckCircle,
    progress: 45
  },
  in_transit: {
    label: 'In Transit',
    color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    icon: Truck,
    progress: 60
  },
  arrived_at_destination: {
    label: 'Arrived',
    color: 'bg-teal-50 text-teal-700 border-teal-200',
    icon: MapPin,
    progress: 75
  },
  customs_clearance: {
    label: 'Customs',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: FileText,
    progress: 85
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    color: 'bg-pink-50 text-pink-700 border-pink-200',
    icon: Navigation,
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
  draft: {
    label: 'Draft',
    color: 'bg-gray-50 text-gray-700 border-gray-200',
    icon: FileText,
    progress: 5
  }
};

// ==================== SHIPMENT MODE CONFIG ====================
const SHIPMENT_MODE_CONFIG = {
  air_freight: { icon: Plane, label: 'Air Freight', color: COLORS.info },
  sea_freight: { icon: Ship, label: 'Sea Freight', color: COLORS.secondary },
  road_freight: { icon: Truck, label: 'Road Freight', color: COLORS.success },
  rail_freight: { icon: Train, label: 'Rail Freight', color: COLORS.purple },
  express_courier: { icon: Package, label: 'Express', color: COLORS.orange }
};

// ==================== BUTTON COMPONENT ====================
const Button = ({ children, variant = 'primary', size = 'md', isLoading, onClick, className = '', icon: Icon, disabled }) => {
  const variants = {
    primary: `bg-[${COLORS.primary}] text-white hover:bg-[#d35400]`,
    secondary: `bg-[${COLORS.secondary}] text-white hover:bg-[#2c5a8c]`,
    outline: `border-2 border-[${COLORS.primary}] text-[${COLORS.primary}] hover:bg-[#fef2e6]`,
    ghost: 'text-gray-600 hover:bg-gray-100',
    success: `bg-[${COLORS.success}] text-white hover:bg-[#0d9488]`,
    danger: `bg-[${COLORS.danger}] text-white hover:bg-[#dc2626]`
  };

  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center ${variants[variant]} ${sizes[size]} ${className} ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Loading...
        </>
      ) : (
        <>
          {Icon && <Icon className="h-4 w-4 mr-2" />}
          {children}
        </>
      )}
    </button>
  );
};

// ==================== INPUT COMPONENT ====================
const Input = ({ type = 'text', label, value, onChange, placeholder, icon: Icon, error, required, className = '' }) => (
  <div className="space-y-1">
    {label && (
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
          <Icon className="h-4 w-4 text-gray-400" />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[${COLORS.primary}] focus:border-transparent ${Icon ? 'pl-10' : ''} ${error ? 'border-red-300' : 'border-gray-300'} ${className}`}
      />
    </div>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

// ==================== SELECT COMPONENT ====================
const Select = ({ label, value, onChange, options, placeholder, icon: Icon, required, className = '' }) => (
  <div className="space-y-1">
    {label && (
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
          <Icon className="h-4 w-4 text-gray-400" />
        </div>
      )}
      <select
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 text-sm border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[${COLORS.primary}] focus:border-transparent ${Icon ? 'pl-10' : 'pl-3'} pr-10 ${className}`}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  </div>
);

// ==================== STATUS BADGE ====================
const StatusBadge = ({ status, size = 'md' }) => {
  const config = STATUS_CONFIG[status] || { label: status, color: 'bg-gray-50 text-gray-700', icon: Clock };
  const Icon = config.icon;
  const sizes = { sm: 'px-2 py-0.5 text-xs', md: 'px-2.5 py-1 text-xs', lg: 'px-3 py-1.5 text-sm' };

  return (
    <span className={`inline-flex items-center rounded-full font-medium border ${config.color} ${sizes[size]}`}>
      <Icon className={`${size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} mr-1`} />
      {config.label}
    </span>
  );
};

// ==================== MODE BADGE ====================
const ModeBadge = ({ mode }) => {
  const config = SHIPMENT_MODE_CONFIG[mode] || { icon: Package, label: mode, color: COLORS.secondary };
  const Icon = config.icon;

  return (
    <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: `${config.color}15`, color: config.color }}>
      <Icon className="h-3.5 w-3.5 mr-1" />
      {config.label}
    </span>
  );
};

// ==================== PROGRESS BAR ====================
const ProgressBar = ({ progress, showLabel = false }) => (
  <div className="w-full">
    {showLabel && (
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-500">Progress</span>
        <span className="text-xs font-medium" style={{ color: COLORS.primary }}>{progress}%</span>
      </div>
    )}
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: progress === 100 ? COLORS.success : COLORS.primary }} />
    </div>
  </div>
);

// ==================== STAT CARD ====================
const StatCard = ({ title, value, icon: Icon, color, onClick, active }) => (
  <div onClick={onClick} className={`bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md ${active ? `border-[${COLORS.primary}] ring-2 ring-[${COLORS.primary}]/20` : 'border-gray-200'}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500 mb-1">{title}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </div>
);

// ==================== ACTION MENU ====================
const ActionMenu = ({ shipment, onAction }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setShowMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const actions = [
    { label: 'View Details', icon: Eye, action: 'view', color: 'text-blue-600' },
    { label: 'View Timeline', icon: Activity, action: 'timeline', color: 'text-purple-600' },
    { label: 'Track Shipment', icon: Navigation, action: 'track', color: 'text-green-600' },
    { label: 'Download Documents', icon: Download, action: 'download', color: 'text-gray-600' }
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setShowMenu(!showMenu)} className="p-2 hover:bg-gray-100 rounded-lg">
        <MoreVertical className="h-4 w-4 text-gray-500" />
      </button>
      {showMenu && (
        <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50 py-1">
          {actions.map(action => (
            <button key={action.action} onClick={() => { onAction(action.action, shipment); setShowMenu(false); }} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center">
              <action.icon className={`h-4 w-4 mr-3 ${action.color}`} />
              <span className="text-gray-700">{action.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ==================== MODAL ====================
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="px-6 py-4 border-b sticky top-0 bg-white flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="px-6 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

// ==================== SHIPMENT DETAILS MODAL ====================
const ShipmentDetailsModal = ({ isOpen, onClose, shipment }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && shipment) fetchTimeline();
  }, [isOpen, shipment]);

  const fetchTimeline = async () => {
    setLoading(true);
    try {
      const result = await getShipmentTimeline(shipment._id);
      if (result.success) setTimeline(result.data || []);
    } catch (error) {
      toast.error('Failed to fetch timeline');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !shipment) return null;

  const totalWeight = calculateTotalWeight(shipment.packages);
  const totalVolume = calculateTotalVolume(shipment.packages);
  const daysInTransit = getDaysInTransit(shipment.transport?.actualDeparture);

  const tabs = [
    { id: 'details', label: 'Details', icon: Package },
    { id: 'packages', label: 'Packages', icon: Box },
    { id: 'transport', label: 'Transport', icon: Truck },
    { id: 'timeline', label: 'Timeline', icon: Activity }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Shipment Details">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold">#{shipment.shipmentNumber || shipment._id?.slice(-8)}</h4>
            {shipment.trackingNumber && <p className="text-sm text-gray-500">Tracking: {shipment.trackingNumber}</p>}
          </div>
          <div className="flex items-center space-x-2">
            <StatusBadge status={shipment.status} size="lg" />
            <ModeBadge mode={shipment.shipmentDetails?.shipmentType} />
          </div>
        </div>

        {/* Progress */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <ProgressBar progress={getShipmentProgress(shipment.status)} showLabel />
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex space-x-4">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-3 py-2 text-sm font-medium border-b-2 flex items-center ${activeTab === tab.id ? `border-[${COLORS.primary}] text-[${COLORS.primary}]` : 'border-transparent text-gray-500'}`}>
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h5 className="text-sm font-medium mb-3 flex items-center">
                  <User className="h-4 w-4 mr-2" style={{ color: COLORS.primary }} />
                  Customer Information
                </h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-sm font-medium">
                      {shipment.customerId?.companyName || 
                       `${shipment.customerId?.firstName || ''} ${shipment.customerId?.lastName || ''}`.trim() || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium">{shipment.customerId?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium">{shipment.customerId?.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h5 className="text-sm font-medium mb-3">Shipment Details</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Origin</p>
                    <p className="text-sm font-medium">{shipment.shipmentDetails?.origin || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Destination</p>
                    <p className="text-sm font-medium">{shipment.shipmentDetails?.destination || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Mode</p>
                    <ModeBadge mode={shipment.shipmentDetails?.shipmentType} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Created</p>
                    <p className="text-sm font-medium">{formatShipmentDate(shipment.createdAt, 'short')}</p>
                  </div>
                </div>
                {shipment.specialInstructions && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Special Instructions</p>
                    <p className="text-sm bg-gray-50 p-2 rounded">{shipment.specialInstructions}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'packages' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-xs text-gray-500">Packages</p>
                  <p className="text-2xl font-semibold" style={{ color: COLORS.primary }}>{shipment.packages?.length || 0}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-xs text-gray-500">Weight</p>
                  <p className="text-2xl font-semibold" style={{ color: COLORS.secondary }}>{formatWeight(totalWeight)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-xs text-gray-500">Volume</p>
                  <p className="text-2xl font-semibold" style={{ color: COLORS.success }}>{formatVolume(totalVolume)}</p>
                </div>
              </div>

              {shipment.packages?.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Type</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Qty</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Weight</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Dimensions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {shipment.packages.map((pkg, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm">{pkg.packageType}</td>
                          <td className="px-4 py-2 text-sm">{pkg.quantity}</td>
                          <td className="px-4 py-2 text-sm">{formatWeight(pkg.weight)}</td>
                          <td className="px-4 py-2 text-sm">
                            {pkg.length && pkg.width && pkg.height 
                              ? `${pkg.length}×${pkg.width}×${pkg.height} cm`
                              : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No package details</p>
              )}
            </div>
          )}

          {activeTab === 'transport' && (
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h5 className="text-sm font-medium mb-3">Transport Details</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Carrier</p>
                    <p className="text-sm font-medium">{shipment.transport?.carrierName || 'Not assigned'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Route</p>
                    <p className="text-sm font-medium">{shipment.transport?.route || 'Direct'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Vessel/Flight</p>
                    <p className="text-sm font-medium">{shipment.transport?.vesselName || shipment.transport?.flightNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Container</p>
                    <p className="text-sm font-medium">{shipment.transport?.containerNumber || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h5 className="text-sm font-medium mb-3">Schedule</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Est. Departure</p>
                    <p className="text-sm font-medium">{shipment.transport?.estimatedDeparture ? formatShipmentDate(shipment.transport.estimatedDeparture, 'short') : 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Est. Arrival</p>
                    <p className="text-sm font-medium">{shipment.transport?.estimatedArrival ? formatShipmentDate(shipment.transport.estimatedArrival, 'short') : 'Not set'}</p>
                  </div>
                </div>
                {shipment.transport?.estimatedArrival && !shipment.actualDeliveryDate && (
                  <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">Days in Transit: <span className="font-medium">{daysInTransit} days</span></p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" style={{ color: COLORS.primary }} />
                </div>
              ) : timeline.length > 0 ? (
                timeline.map((event, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      event.type === 'status' ? 'bg-blue-100' : 
                      event.type === 'tracking' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {event.type === 'status' && <Activity className="h-4 w-4 text-blue-600" />}
                      {event.type === 'tracking' && <MapPin className="h-4 w-4 text-green-600" />}
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">{event.title || getShipmentStatusDisplayText(event.status)}</p>
                        <p className="text-xs text-gray-400">{formatShipmentDate(event.timestamp || event.createdAt, 'short')}</p>
                      </div>
                      {event.description && <p className="text-xs text-gray-600 mt-1">{event.description}</p>}
                      {event.location && <p className="text-xs text-gray-500 mt-1 flex items-center"><MapPin className="h-3 w-3 mr-1" />{event.location}</p>}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No timeline events</p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="primary" onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};

// ==================== TRACKING MODAL ====================
const TrackingModal = ({ isOpen, onClose, trackingNumber }) => {
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && trackingNumber) fetchTracking();
  }, [isOpen, trackingNumber]);

  const fetchTracking = async () => {
    setLoading(true);
    try {
      const result = await trackShipmentByNumber(trackingNumber);
      if (result.success) setTrackingData(result.data);
      else toast.error(result.message);
    } catch (error) {
      toast.error('Failed to fetch tracking');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Track Shipment">
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" style={{ color: COLORS.primary }} />
        </div>
      ) : trackingData ? (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500">Tracking Number</p>
                <p className="text-lg font-semibold">{trackingData.trackingNumber}</p>
              </div>
              <StatusBadge status={trackingData.status} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Origin</p>
                <p className="text-sm font-medium">{trackingData.origin}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Destination</p>
                <p className="text-sm font-medium">{trackingData.destination}</p>
              </div>
            </div>
          </div>

          <div>
            <h5 className="text-sm font-medium mb-3">Tracking History</h5>
            <div className="space-y-4">
              {trackingData.trackingHistory?.map((event, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">{event.status}</p>
                      <p className="text-xs text-gray-400">{formatShipmentDate(event.timestamp, 'short')}</p>
                    </div>
                    <p className="text-xs text-gray-600">{event.location}</p>
                    {event.description && <p className="text-xs text-gray-500 mt-1">{event.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center py-4">No tracking information found</p>
      )}
    </Modal>
  );
};

// ==================== MAIN COMPONENT ====================
export default function ShipmentsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [shipments, setShipments] = useState([]);
  const [myShipments, setMyShipments] = useState([]);
  const [activeView, setActiveView] = useState('all'); // 'all' or 'my'
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, pages: 1 });
  const [myPagination, setMyPagination] = useState({ total: 0, page: 1, limit: 10, pages: 1 });

  // Filter State
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    status: '',
    mode: '',
    search: '',
    startDate: '',
    endDate: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const [myFilters, setMyFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    sort: '-createdAt'
  });

  const [showFilters, setShowFilters] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    delivered: 0,
    pending: 0,
    inTransit: 0
  });

  const [myStats, setMyStats] = useState({
    total: 0,
    active: 0,
    delivered: 0,
    pending: 0
  });

  // Fetch All Shipments (Protected)
  const fetchAllShipments = async () => {
    setLoading(true);
    try {
      const response = await getAllShipments(filters);
      if (response.success) {
        setShipments(response.data || []);
        setPagination(response.pagination);
        const summary = getShipmentSummary(response.data || []);
        setStats(summary);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Failed to fetch shipments');
    } finally {
      setLoading(false);
    }
  };

  // Fetch My Shipments (Customer)
  const fetchMyShipments = async () => {
    setLoading(true);
    try {
      const response = await getMyShipments(myFilters);
      if (response.success) {
        setMyShipments(response.data || []);
        setMyPagination(response.pagination);
        const summary = getShipmentSummary(response.data || []);
        setMyStats(summary);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Failed to fetch your shipments');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Dashboard Stats
  const fetchStats = async () => {
    try {
      const response = await getShipmentStatistics();
      if (response.success && response.data) {
        // Update stats if needed
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useEffect(() => {
    if (activeView === 'all') {
      fetchAllShipments();
    } else {
      fetchMyShipments();
    }
    fetchStats();
  }, [activeView, filters.page, myFilters.page]);

  // Handle Filter Change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (activeView === 'all') {
      setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
    } else {
      setMyFilters(prev => ({ ...prev, [name]: value, page: 1 }));
    }
  };

  // Handle Search
  const handleSearch = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  // Clear Filters
  const clearFilters = () => {
    setFilters({ page: 1, limit: 20, status: '', mode: '', search: '', startDate: '', endDate: '', sortBy: 'createdAt', sortOrder: 'desc' });
    setMyFilters({ page: 1, limit: 10, status: '', sort: '-createdAt' });
    toast.info('Filters cleared');
  };

  // Handle Actions
  const handleAction = async (action, shipment) => {
    setSelectedShipment(shipment);
    switch (action) {
      case 'view':
        setShowDetailsModal(true);
        break;
      case 'timeline':
        setShowTimelineModal(true);
        break;
      case 'track':
        if (shipment.trackingNumber) {
          setTrackingNumber(shipment.trackingNumber);
          setShowTrackingModal(true);
        } else {
          toast.warning('No tracking number available');
        }
        break;
      case 'download':
        toast.info('Download feature coming soon');
        break;
    }
  };

  // Handle Export
  const handleExport = () => {
    if (shipments.length === 0) {
      toast.warning('No shipments to export');
      return;
    }
    exportShipmentsToCSV(shipments);
    toast.success(`${shipments.length} shipments exported`);
  };

  // Options
  const statusOptions = Object.keys(STATUS_CONFIG).map(key => ({ value: key, label: STATUS_CONFIG[key].label }));
  const modeOptions = Object.keys(SHIPMENT_MODE_CONFIG).map(key => ({ value: key, label: SHIPMENT_MODE_CONFIG[key].label }));

  // Stats for current view
  const currentStats = activeView === 'all' ? stats : myStats;
  const visibleStats = [
    { key: 'all', label: 'All', value: currentStats.total, icon: Package, color: 'bg-gray-100 text-gray-600' },
    { key: 'active', label: 'Active', value: currentStats.active, icon: Activity, color: 'bg-blue-100 text-blue-600' },
    { key: 'pending', label: 'Pending', value: currentStats.pending, icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
    { key: 'inTransit', label: 'In Transit', value: currentStats.inTransit, icon: Truck, color: 'bg-cyan-100 text-cyan-600' },
    { key: 'delivered', label: 'Delivered', value: currentStats.delivered, icon: CheckCircleSolid, color: 'bg-green-100 text-green-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fef2e6' }}>
                  <Package className="h-4 w-4" style={{ color: COLORS.primary }} />
                </div>
                <h1 className="ml-2 text-lg font-semibold text-gray-900">Shipments</h1>
              </div>
              <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
                <button onClick={() => setActiveView('all')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeView === 'all' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}>
                  All Shipments
                </button>
                <button onClick={() => setActiveView('my')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeView === 'my' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}>
                  My Shipments
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="light" size="sm" onClick={handleExport} icon={ExportIcon}>
                Export
              </Button>
              {activeView === 'all' && (
                <Button variant="primary" size="sm" onClick={() => router.push('/shipments/create')} icon={Plus}>
                  New Shipment
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          {visibleStats.map(stat => (
            <StatCard key={stat.key} title={stat.label} value={stat.value} icon={stat.icon} color={stat.color} />
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="p-4">
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder={activeView === 'all' ? "Search by number, tracking, customer..." : "Search your shipments..."}
                  value={filters.search}
                  onChange={handleSearch}
                  icon={Search}
                />
              </div>
              <Button variant={showFilters ? 'primary' : 'light'} size="md" onClick={() => setShowFilters(!showFilters)} icon={FilterIcon}>
                Filters
                {(filters.status || filters.mode || filters.startDate || filters.endDate) && (
                  <span className="ml-2 bg-white text-[#E67E22] rounded-full px-2 py-0.5 text-xs">
                    {Object.values(filters).filter(v => v && v !== '' && v !== 20 && v !== 1).length}
                  </span>
                )}
              </Button>
              {(filters.search || filters.status || filters.mode || filters.startDate || filters.endDate) && (
                <Button variant="light" size="md" onClick={clearFilters} icon={X}>
                  Clear
                </Button>
              )}
              <Button variant="light" size="md" onClick={activeView === 'all' ? fetchAllShipments : fetchMyShipments} icon={RefreshCw} isLoading={loading} />
            </div>

            {/* Advanced Filters */}
            {showFilters && activeView === 'all' && (
              <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select name="status" value={filters.status} onChange={handleFilterChange} options={statusOptions} placeholder="All Statuses" label="Status" icon={Activity} />
                <Select name="mode" value={filters.mode} onChange={handleFilterChange} options={modeOptions} placeholder="All Modes" label="Mode" icon={Truck} />
                <Input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} label="From Date" icon={Calendar} />
                <Input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} label="To Date" icon={Calendar} />
              </div>
            )}

            {showFilters && activeView === 'my' && (
              <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select name="status" value={myFilters.status} onChange={handleFilterChange} options={statusOptions} placeholder="All Statuses" label="Status" icon={Activity} />
              </div>
            )}
          </div>
        </div>

        {/* Shipments Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleSort('shipmentNumber')}>
                    <div className="flex items-center">
                      Shipment Info
                      <ArrowUpDown className="h-4 w-4 ml-1" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleSort('createdAt')}>
                    <div className="flex items-center">
                      Date
                      <ArrowUpDown className="h-4 w-4 ml-1" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Packages</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="9" className="px-4 py-8 text-center">
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin" style={{ color: COLORS.primary }} />
                        <span className="ml-2 text-sm text-gray-500">Loading shipments...</span>
                      </div>
                    </td>
                  </tr>
                ) : (activeView === 'all' ? shipments : myShipments).length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-4 py-8 text-center">
                      <div className="flex flex-col items-center">
                        <Package className="h-12 w-12 text-gray-400 mb-3" />
                        <p className="text-sm text-gray-500">No shipments found</p>
                        {activeView === 'all' && (
                          <Button variant="primary" size="sm" onClick={() => router.push('/shipments/create')} className="mt-3" icon={Plus}>
                            Create New Shipment
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  (activeView === 'all' ? shipments : myShipments).map((shipment) => {
                    const totalWeight = calculateTotalWeight(shipment.packages);
                    const progress = getShipmentProgress(shipment.status);
                    
                    return (
                      <tr key={shipment._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div>
                            <div className="text-sm font-medium cursor-pointer hover:underline" style={{ color: COLORS.primary }} onClick={() => { setSelectedShipment(shipment); setShowDetailsModal(true); }}>
                              #{shipment.shipmentNumber || shipment._id?.slice(-8)}
                            </div>
                            {shipment.trackingNumber && (
                              <div className="text-xs text-gray-500 flex items-center mt-1">
                                <Hash className="h-3 w-3 mr-1" />
                                {shipment.trackingNumber}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium">
                            {shipment.customerId?.companyName || 
                             `${shipment.customerId?.firstName || ''} ${shipment.customerId?.lastName || ''}`.trim() || 'N/A'}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center text-xs">
                            <span className="font-medium">{shipment.shipmentDetails?.origin || 'N/A'}</span>
                            <ChevronRight className="h-3 w-3 mx-1 text-gray-400" />
                            <span className="font-medium">{shipment.shipmentDetails?.destination || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <ModeBadge mode={shipment.shipmentDetails?.shipmentType} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-xs text-gray-500">
                            {formatShipmentDate(shipment.createdAt, 'short')}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-xs">
                            <span className="font-medium">{shipment.packages?.length || 0}</span>
                            <span className="text-gray-500 ml-1">pkgs</span>
                            <div className="text-gray-500">{formatWeight(totalWeight)}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={shipment.status} size="sm" />
                        </td>
                        <td className="px-4 py-3">
                          <div className="w-24">
                            <ProgressBar progress={progress} />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <ActionMenu shipment={shipment} onAction={handleAction} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div> 
        </div>
      </div>

      {/* Modals */}
      <ShipmentDetailsModal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} shipment={selectedShipment} />
      
      <TrackingModal isOpen={showTrackingModal} onClose={() => setShowTrackingModal(false)} trackingNumber={trackingNumber} />
    </div>
  );
}