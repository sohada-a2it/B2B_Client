// app/tracking-number/page.js
'use client';

import React, { useState } from 'react';
import { 
  Search, Package, MapPin, Calendar, Clock, Ship, Truck,
  Weight, Box, Layers, ChevronDown, ChevronUp, FileText,
  Container, User, Building, Phone, Mail, CheckCircle,
  AlertCircle, XCircle, Download, QrCode
} from 'lucide-react';
import { toast } from 'react-toastify';
import { trackByNumber } from '@/Api/booking';

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

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'picked_up_from_warehouse': 'bg-blue-100 text-blue-800',
      'received_at_warehouse': 'bg-purple-100 text-purple-800',
      'consolidated': 'bg-indigo-100 text-indigo-800',
      'departed_port_of_origin': 'bg-orange-100 text-orange-800',
      'in_transit_sea_freight': 'bg-amber-100 text-amber-800',
      'arrived_at_destination_port': 'bg-green-100 text-green-800',
      'customs_cleared': 'bg-emerald-100 text-emerald-800',
      'out_for_delivery': 'bg-sky-100 text-sky-800',
      'delivered': 'bg-green-600 text-white',
      'on_hold': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };
const formatAddress = (address) => {
  if (!address) return 'N/A';
  
  // যদি স্ট্রিং হয়
  if (typeof address === 'string') return address;
  
  // যদি অবজেক্ট হয়
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
    if (!status) return 'Unknown';
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-US', {
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
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(trackingData.status)}`}>
                  {formatStatus(trackingData.status)}
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
                    style={{ width: `${trackingData.progress || 0}%` }}
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
                  <p className="text-xs text-gray-400">{trackingData.route?.lastUpdate || 'N/A'}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">TO</p>
                  <p className="font-medium text-lg">{getRouteDestination()}</p>
                  {getEstimatedArrival() && (
                    <p className="text-xs text-gray-400">
                      ETA: {formatDate(getEstimatedArrival())}
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
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    activeTab === 'overview' 
                      ? 'text-orange-600 border-b-2 border-orange-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('packages')}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    activeTab === 'packages' 
                      ? 'text-orange-600 border-b-2 border-orange-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Packages ({trackingData.packages?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    activeTab === 'timeline' 
                      ? 'text-orange-600 border-b-2 border-orange-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Timeline
                </button>
                <button
                  onClick={() => setActiveTab('details')}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
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
                  {trackingData.timeline && trackingData.timeline.length > 0 ? (
                    <div className="space-y-4">
                      {trackingData.timeline.map((event, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="relative">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              index === 0 ? 'bg-orange-100' : 'bg-gray-100'
                            }`}>
                              {index === 0 ? (
                                <Package className="h-4 w-4 text-orange-600" />
                              ) : (
                                <div className="w-2 h-2 bg-gray-400 rounded-full" />
                              )}
                            </div>
                            {index < trackingData.timeline.length - 1 && (
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
                              <p className="text-xs text-gray-400">{event.formattedDate || formatDate(event.date)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
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
                            <MapPin className="h-3 w-3 inline mr-1" /> {formatAddress(trackingData.sender.address) || 'N/A'}
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
                            <MapPin className="h-3 w-3 inline mr-1" /> {trackingData.receiver.address || 'N/A'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}