// app/tracking-number/page.js
'use client';

import React, { useState } from 'react';
import { 
  Search, Package, MapPin, Calendar, Clock, Ship, Truck,
  Weight, Box, Layers, ChevronDown, ChevronUp, FileText,
  Container, User, Building, Phone, Mail, CheckCircle,
  AlertCircle, XCircle, Download, QrCode, Shield,
  Award, Send, Play, Pause, Ban, RotateCcw, Flag
} from 'lucide-react';
import { toast } from 'react-toastify';
import { trackByNumber } from '@/Api/booking';

// Status configuration for consistent display
// app/tracking-number/page.js - STATUS_CONFIG-এ সব স্ট্যাটাস যোগ করুন

const STATUS_CONFIG = {
  // Initial statuses
  'pending': { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Package, progress: 10 },
  'picked_up_from_warehouse': { label: 'Picked Up', color: 'bg-blue-100 text-blue-800', icon: Truck, progress: 20 },
  'received_at_warehouse': { label: 'Received at Warehouse', color: 'bg-purple-100 text-purple-800', icon: Building, progress: 25 },
  
  // Consolidation statuses (নতুন)
  'pending_consolidation': { label: 'Pending Consolidation', color: 'bg-indigo-100 text-indigo-800', icon: Layers, progress: 28 },
  'consolidating': { label: 'Consolidating', color: 'bg-indigo-200 text-indigo-800', icon: Layers, progress: 29 },
  'consolidated': { label: 'Consolidated', color: 'bg-indigo-100 text-indigo-800', icon: Layers, progress: 30 },
  'ready_for_dispatch': { label: 'Ready for Dispatch', color: 'bg-blue-100 text-blue-800', icon: Package, progress: 35 },
  'loaded_in_container': { label: 'Loaded In Container', color: 'bg-blue-200 text-blue-800', icon: Container, progress: 38 },
  'dispatched': { label: 'Dispatched', color: 'bg-orange-100 text-orange-800', icon: Truck, progress: 40 },
  
  // Departure/transit statuses
  'departed_port_of_origin': { label: 'Departed Origin Port', color: 'bg-orange-100 text-orange-800', icon: Ship, progress: 40 },
  'in_transit_sea_freight': { label: 'In Transit', color: 'bg-amber-100 text-amber-800', icon: Ship, progress: 50 },
  'in_transit_air_freight': { label: 'In Transit', color: 'bg-amber-100 text-amber-800', icon: Truck, progress: 50 },
  'in_transit': { label: 'In Transit', color: 'bg-amber-100 text-amber-800', icon: Truck, progress: 50 },
  
  // Arrival statuses
  'arrived_at_destination_port': { label: 'Arrived at Destination Port', color: 'bg-green-100 text-green-800', icon: Flag, progress: 60 },
  'arrived': { label: 'Arrived', color: 'bg-green-100 text-green-800', icon: CheckCircle, progress: 60 },
  
  // Customs statuses
  'customs_cleared': { label: 'Customs Cleared', color: 'bg-emerald-100 text-emerald-800', icon: Shield, progress: 70 },
  
  // Delivery statuses
  'out_for_delivery': { label: 'Out for Delivery', color: 'bg-sky-100 text-sky-800', icon: Truck, progress: 80 },
  
  // Final statuses
  'delivered': { label: 'Delivered', color: 'bg-green-600 text-white', icon: CheckCircle, progress: 100 },
  'completed': { label: 'Completed', color: 'bg-emerald-600 text-white', icon: Award, progress: 100 },
  
  // Problem statuses
  'on_hold': { label: 'On Hold', color: 'bg-gray-100 text-gray-800', icon: Pause, progress: 0 },
  'cancelled': { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: Ban, progress: 0 },
  'returned': { label: 'Returned', color: 'bg-red-100 text-red-800', icon: RotateCcw, progress: 0 }
};

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState(null);
  const [showAllPackages, setShowAllPackages] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleTrack = async (e) => {
    e.preventDefault();
    
    if (!trackingNumber.trim()) {
      toast.warning('Please enter a tracking number');
      return;
    }

    setLoading(true);
    setError(null);
    setTrackingData(null);
    
    try {
      const result = await trackByNumber(trackingNumber);
      
      console.log('📦 API Response:', result);
      
      if (result.success) {
        setTrackingData(result.data);
        toast.success('Tracking data found');
      } else {
        setError(result.message || 'No shipment found with this tracking number');
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch tracking data');
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    return STATUS_CONFIG[status] || {
      label: status?.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ') || 'Unknown',
      color: 'bg-gray-100 text-gray-800',
      icon: Package,
      progress: 0
    };
  };

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    
    if (typeof address === 'string') return address;
    
    const parts = [];
    if (address.addressLine1) parts.push(address.addressLine1);
    if (address.addressLine2) parts.push(address.addressLine2);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.country) parts.push(address.country);
    if (address.postalCode) parts.push(address.postalCode);
    
    return parts.length > 0 ? parts.join(', ') : JSON.stringify(address);
  };

  const formatStatus = (status) => {
    return getStatusConfig(status).label;
  };

  const getStatusColor = (status) => {
    return getStatusConfig(status).color;
  };

  const getStatusIcon = (status) => {
    return getStatusConfig(status).icon;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount, currency = 'USD') => {
    if (!amount) return 'N/A';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
      }).format(amount);
    } catch {
      return `${amount} ${currency}`;
    }
  };

  // Calculate progress based on status
  const calculateProgress = () => {
    if (!trackingData?.status) return 0;
    
    // If delivered or completed, always show 100%
    if (trackingData.status === 'delivered' || trackingData.status === 'completed') {
      return 100;
    }
    
    // Get progress from config
    const config = getStatusConfig(trackingData.status);
    return config.progress || 0;
  };

  // Safe data access helpers
  const getRouteOrigin = () => {
    return trackingData?.route?.origin || 
           trackingData?.origin || 
           trackingData?.shipmentDetails?.origin || 
           'N/A';
  };

  const getRouteDestination = () => {
    return trackingData?.route?.destination || 
           trackingData?.destination || 
           trackingData?.shipmentDetails?.destination || 
           'N/A';
  };

  const getCurrentLocation = () => {
    // Try to get from timeline first
    if (trackingData?.timeline && trackingData.timeline.length > 0) {
      const latestEvent = trackingData.timeline[0];
      if (latestEvent.location) return latestEvent.location;
    }
    
    return trackingData?.route?.currentLocation || 
           trackingData?.currentLocation || 
           'In Transit';
  };

  const getEstimatedDeparture = () => {
    return trackingData?.dates?.estimatedDeparture || 
           trackingData?.estimatedDeparture || 
           null;
  };

  const getEstimatedArrival = () => {
    return trackingData?.dates?.estimatedArrival || 
           trackingData?.estimatedArrival || 
           trackingData?.eta || 
           null;
  };

  const getLastUpdate = () => {
    if (trackingData?.timeline && trackingData.timeline.length > 0) {
      return trackingData.timeline[0].formattedDate || formatDate(trackingData.timeline[0].date);
    }
    return trackingData?.route?.lastUpdate || 'N/A';
  };

  // Get all timeline events sorted by date
  const getSortedTimeline = () => {
    if (!trackingData?.timeline) return [];
    
    return [...trackingData.timeline].sort((a, b) => {
      const dateA = new Date(a.date || a.timestamp || 0);
      const dateB = new Date(b.date || b.timestamp || 0);
      return dateB - dateA; // Most recent first
    });
  };

  const StatusIcon = ({ status }) => {
    const IconComponent = getStatusIcon(status);
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-4">Track Your Shipment</h1>
          <p className="text-xl opacity-90">
            Enter your tracking number to get real-time updates
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-3xl mx-auto px-4 -mt-8">
        <form onSubmit={handleTrack} className="bg-white rounded-xl shadow-xl p-2 flex">
          <div className="flex-1 flex items-center px-4">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
              placeholder="Enter tracking number (e.g., CLC-LJ9787QA)"
              className="w-full px-3 py-4 focus:outline-none"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-[#E67E22] text-white rounded-lg hover:bg-[#d35400] disabled:bg-gray-300 font-medium min-w-[120px]"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>
      </div>

      {/* Results Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-red-800 mb-2">Shipment Not Found</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">
              Please check your tracking number and try again
            </p>
          </div>
        )}

        {trackingData && !error && (
          <div className="space-y-6">
            {/* ===== HEADER ===== */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{trackingData.trackingNumber || 'N/A'}</h2>
                  <p className="text-gray-500">
                    Booking: {trackingData.bookingNumber || 'N/A'} | Shipment: {trackingData.shipmentNumber || 'N/A'}
                  </p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${getStatusColor(trackingData.status)}`}>
                  <StatusIcon status={trackingData.status} />
                  <span className="ml-1">{formatStatus(trackingData.status)}</span>
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Pending</span>
                  <span>In Transit</span>
                  <span>Delivered</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${calculateProgress()}%` }}
                  />
                </div>
              </div>

              {/* Route - Safe access with fallbacks */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">FROM</p>
                  <p className="font-medium text-lg">{getRouteOrigin()}</p>
                  {getEstimatedDeparture() && (
                    <p className="text-xs text-gray-400">
                      Dep: {formatDate(getEstimatedDeparture())}
                    </p>
                  )}
                </div>
                <div className="text-center border-l border-r border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">CURRENT</p>
                  <p className="font-medium text-lg">{getCurrentLocation()}</p>
                  <p className="text-xs text-gray-400">{getLastUpdate()}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">TO</p>
                  <p className="font-medium text-lg">{getRouteDestination()}</p>
                  {getEstimatedArrival() && (
                    <p className="text-xs text-gray-400">
                      {formatDate(getEstimatedArrival())}
                    </p>
                  )}
                </div>
              </div>

              {/* Classification */}
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <Ship className="h-4 w-4 mr-1" />
                <span>
                  {trackingData.classification?.mainTypeDisplay || 'N/A'} - {trackingData.classification?.subTypeDisplay || 'N/A'}
                </span>
              </div>
            </div>

            {/* ===== TABS ===== */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="flex border-b overflow-x-auto">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                    activeTab === 'overview' 
                      ? 'text-orange-600 border-b-2 border-orange-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('packages')}
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                    activeTab === 'packages' 
                      ? 'text-orange-600 border-b-2 border-orange-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Packages ({trackingData.packages?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                    activeTab === 'timeline' 
                      ? 'text-orange-600 border-b-2 border-orange-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Timeline
                </button>
                <button
                  onClick={() => setActiveTab('details')}
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                    activeTab === 'details' 
                      ? 'text-orange-600 border-b-2 border-orange-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Details
                </button>
              </div>

              {/* ===== TAB CONTENT ===== */}

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Shipment Summary */}
                    <div>
                      <h3 className="font-medium mb-3 flex items-center">
                        <Package className="h-4 w-4 text-orange-500 mr-2" />
                        Shipment Summary
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between py-1 border-b">
                          <span className="text-gray-500">Total Packages</span>
                          <span className="font-medium">{trackingData.shipmentDetails?.totalPackages || 0}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b">
                          <span className="text-gray-500">Total Weight</span>
                          <span className="font-medium">{trackingData.shipmentDetails?.totalWeight || 0} kg</span>
                        </div>
                        <div className="flex justify-between py-1 border-b">
                          <span className="text-gray-500">Total Volume</span>
                          <span className="font-medium">{trackingData.shipmentDetails?.totalVolume || 0} m³</span>
                        </div>
                        <div className="flex justify-between py-1 border-b">
                          <span className="text-gray-500">Shipping Mode</span>
                          <span className="font-medium">{trackingData.shipmentDetails?.shippingMode || 'DDU'}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-gray-500">Service Type</span>
                          <span className="font-medium capitalize">{trackingData.shipmentDetails?.serviceType || 'standard'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Container Info */}
                    {trackingData.container && (
                      <div>
                        <h3 className="font-medium mb-3 flex items-center">
                          <Container className="h-4 w-4 text-orange-500 mr-2" />
                          Container Information
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between py-1 border-b">
                            <span className="text-gray-500">Container Number</span>
                            <span className="font-medium">{trackingData.container.number || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b">
                            <span className="text-gray-500">Container Type</span>
                            <span className="font-medium">{trackingData.container.type || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b">
                            <span className="text-gray-500">Seal Number</span>
                            <span className="font-medium">{trackingData.container.seal || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Consolidation Info */}
                    {trackingData.consolidation && (
                      <div className="md:col-span-2">
                        <h3 className="font-medium mb-3 flex items-center">
                          <Layers className="h-4 w-4 text-orange-500 mr-2" />
                          Consolidation Information
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-orange-50 p-4 rounded-lg">
                          <div>
                            <p className="text-xs text-gray-500">Consolidation #</p>
                            <p className="font-medium">{trackingData.consolidation.number || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Container</p>
                            <p className="font-medium">{trackingData.consolidation.containerNumber || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Origin</p>
                            <p className="font-medium">{trackingData.consolidation.originWarehouse || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Destination</p>
                            <p className="font-medium">{trackingData.consolidation.destinationPort || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Packages Tab */}
              {activeTab === 'packages' && (
                <div className="p-6">
                  <h3 className="font-medium mb-4">Package Details</h3>
                  {trackingData.packages && trackingData.packages.length > 0 ? (
                    <div className="space-y-3">
                      {(showAllPackages ? trackingData.packages : trackingData.packages.slice(0, 3)).map((pkg, index) => (
                        <div key={index} className="border rounded-lg p-4 hover:shadow-md transition">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <span className="font-medium">Package #{pkg.id || index + 1}</span>
                              <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                                {pkg.type || 'Carton'}
                              </span>
                            </div>
                            {pkg.hazardous === 'Yes' && (
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                                Hazardous
                              </span>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">{pkg.description || 'No description'}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <p className="text-xs text-gray-500">Quantity</p>
                              <p className="font-medium">{pkg.quantity || 1}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Weight</p>
                              <p className="font-medium">{pkg.weight || 0} kg</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Volume</p>
                              <p className="font-medium">{pkg.volume || 0} m³</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Dimensions</p>
                              <p className="font-medium text-xs">{pkg.dimensions || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      ))}

                      {trackingData.packages.length > 3 && (
                        <button
                          onClick={() => setShowAllPackages(!showAllPackages)}
                          className="w-full py-2 text-orange-500 text-sm flex items-center justify-center"
                        >
                          {showAllPackages ? 'Show Less' : `Show All (${trackingData.packages.length} packages)`}
                          {showAllPackages ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-4">No package information available</p>
                  )}
                </div>
              )}

              {/* Timeline Tab */}
              {activeTab === 'timeline' && (
                <div className="p-6">
                  <h3 className="font-medium mb-4">Tracking Timeline</h3>
                  {getSortedTimeline().length > 0 ? (
                    <div className="space-y-4">
                      {getSortedTimeline().map((event, index) => {
                        const StatusIcon = getStatusIcon(event.status);
                        return (
                          <div key={index} className="flex items-start gap-4">
                            <div className="relative">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                index === 0 ? 'bg-orange-100' : 'bg-gray-100'
                              }`}>
                                <StatusIcon className={`h-4 w-4 ${
                                  index === 0 ? 'text-orange-600' : 'text-gray-600'
                                }`} />
                              </div>
                              {index < getSortedTimeline().length - 1 && (
                                <div className="absolute top-8 left-4 w-0.5 h-12 bg-gray-200" />
                              )}
                            </div>
                            <div className="flex-1 pb-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{formatStatus(event.status)}</p>
                                  <p className="text-sm text-gray-500">{event.location || 'Unknown'}</p>
                                  {event.description && (
                                    <p className="text-xs text-gray-400 mt-1">{event.description}</p>
                                  )}
                                </div>
                                <p className="text-xs text-gray-400">
                                  {event.formattedDate || formatDate(event.date || event.timestamp)}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-4">No timeline information available</p>
                  )}
                </div>
              )}

              {/* Details Tab */}
              {activeTab === 'details' && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sender Info */}
                    {trackingData.sender && (
                      <div>
                        <h3 className="font-medium mb-3 flex items-center">
                          <User className="h-4 w-4 text-orange-500 mr-2" />
                          Sender Information
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                          <p className="font-medium">{trackingData.sender.name || 'N/A'}</p>
                          {trackingData.sender.companyName && (
                            <p className="text-sm text-gray-600">{trackingData.sender.companyName}</p>
                          )}
                          <p className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" /> {trackingData.sender.email || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <Phone className="h-3 w-3 mr-1" /> {trackingData.sender.phone || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-500">
                            <MapPin className="h-3 w-3 inline mr-1" /> {formatAddress(trackingData.sender.address)}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Receiver Info */}
                    {trackingData.receiver && (
                      <div>
                        <h3 className="font-medium mb-3 flex items-center">
                          <User className="h-4 w-4 text-orange-500 mr-2" />
                          Receiver Information
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                          <p className="font-medium">{trackingData.receiver.name || 'N/A'}</p>
                          {trackingData.receiver.companyName && (
                            <p className="text-sm text-gray-600">{trackingData.receiver.companyName}</p>
                          )}
                          <p className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" /> {trackingData.receiver.email || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <Phone className="h-3 w-3 mr-1" /> {trackingData.receiver.phone || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-500">
                            <MapPin className="h-3 w-3 inline mr-1" /> {formatAddress(trackingData.receiver.address)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Additional Details */}
                  {(trackingData.shipmentDetails?.notes || trackingData.notes) && (
                    <div className="mt-6">
                      <h3 className="font-medium mb-3">Notes</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">
                          {trackingData.shipmentDetails?.notes || trackingData.notes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Print
              </button>
              <button
                onClick={() => {
                  // Generate QR code or share link
                  toast.info('Share feature coming soon');
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm flex items-center"
              >
                <QrCode className="h-4 w-4 mr-2" />
                Share
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}