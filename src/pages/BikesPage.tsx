import React, { useState, useEffect, useMemo } from 'react';
import { Bike } from '../types';
import { BikeCard } from '../components/BikeCard';
import { api } from '../services/api';
import {
  Search,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  Zap,
  Fuel,
  Sparkles,
  CheckCircle2,
  Calendar,
  LayoutGrid,
  List,
  MapPin,
  X,
  ArrowRight,
  ShieldCheck,
  Gauge,
} from 'lucide-react';

interface BikesPageProps {
  bikes?: Bike[];
  onSelectBike?: (bike: Bike | string) => void;
  onBookBike?: (bike: Bike) => void;
}

export const BikesPage: React.FC<BikesPageProps> = ({
  bikes: initialBikes,
  onSelectBike,
  onBookBike,
}) => {
  const [bikesList, setBikesList] = useState<Bike[]>(initialBikes || []);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'AVAILABLE' | 'RESERVED' | 'MAINTENANCE'
  const [brandFilter, setBrandFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [fuelFilter, setFuelFilter] = useState('ALL');
  const [hubFilter, setHubFilter] = useState('ALL');
  const [transmissionFilter, setTransmissionFilter] = useState('ALL');
  const [maxPrice, setMaxPrice] = useState<number>(1200);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (initialBikes && initialBikes.length > 0) {
      setBikesList(initialBikes);
    } else {
      api.getBikes()
        .then((data) => setBikesList(data || []))
        .catch((err) => console.error('Failed to load bikes in BikesPage:', err));
    }
  }, [initialBikes]);

  const handleSelect = (bike: Bike) => {
    if (typeof onSelectBike === 'function') {
      onSelectBike(bike.id || (bike as any));
    }
  };

  const handleBook = (bike: Bike) => {
    if (typeof onBookBike === 'function') {
      onBookBike(bike);
    } else if (typeof onSelectBike === 'function') {
      onSelectBike(bike.id || (bike as any));
    }
  };

  // Available brands derived dynamically from the DB bikes list
  const uniqueBrands = useMemo(() => {
    const brands = Array.from(
      new Set((bikesList || []).map((b) => b?.brand).filter(Boolean) as string[])
    ).sort();
    return brands;
  }, [bikesList]);

  // Unique bike types
  const uniqueTypes = useMemo(() => {
    const types = Array.from(
      new Set((bikesList || []).map((b) => b?.bikeType).filter(Boolean) as string[])
    ).sort();
    return types;
  }, [bikesList]);

  // Unique campus hubs
  const uniqueHubs = useMemo(() => {
    const hubs = Array.from(
      new Set((bikesList || []).map((b) => b?.pickupHub).filter(Boolean) as string[])
    ).sort();
    return hubs;
  }, [bikesList]);

  // Filtered bikes
  const filteredBikes = useMemo(() => {
    return (bikesList || []).filter((b) => {
      if (!b) return false;
      // Must be active & approved by admin for public view
      if (!b.active || !b.approvedByAdmin) return false;

      // Status
      if (statusFilter !== 'ALL' && b.availabilityStatus !== statusFilter) return false;

      // Brand
      if (brandFilter !== 'ALL' && (b.brand || '').toLowerCase() !== brandFilter.toLowerCase()) return false;

      // Type
      if (typeFilter !== 'ALL' && (b.bikeType || '').toLowerCase() !== typeFilter.toLowerCase()) return false;

      // Fuel
      if (fuelFilter !== 'ALL' && (b.fuelType || '').toLowerCase() !== fuelFilter.toLowerCase()) return false;

      // Hub
      if (hubFilter !== 'ALL' && !(b.pickupHub || '').toLowerCase().includes(hubFilter.toLowerCase())) return false;

      // Transmission
      if (transmissionFilter !== 'ALL' && (b.transmission || '').toLowerCase() !== transmissionFilter.toLowerCase())
        return false;

      // Max price
      if (b.pricePerDay > maxPrice) return false;

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const match =
          (b.brand || '').toLowerCase().includes(q) ||
          (b.model || '').toLowerCase().includes(q) ||
          (b.pickupHub || '').toLowerCase().includes(q) ||
          (b.description || '').toLowerCase().includes(q) ||
          (b.ownerName || '').toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [
    bikesList,
    statusFilter,
    brandFilter,
    typeFilter,
    fuelFilter,
    hubFilter,
    transmissionFilter,
    maxPrice,
    search,
  ]);

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setBrandFilter('ALL');
    setTypeFilter('ALL');
    setFuelFilter('ALL');
    setHubFilter('ALL');
    setTransmissionFilter('ALL');
    setMaxPrice(1200);
  };

  const hasActiveFilters =
    search !== '' ||
    statusFilter !== 'ALL' ||
    brandFilter !== 'ALL' ||
    typeFilter !== 'ALL' ||
    fuelFilter !== 'ALL' ||
    hubFilter !== 'ALL' ||
    transmissionFilter !== 'ALL' ||
    maxPrice < 1200;

  const availableCount = (filteredBikes || []).filter((b) => b && b.availabilityStatus === 'AVAILABLE').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-amber-400 font-mono mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>ICFAI Campus Marketplace</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">{availableCount} Live Available</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-neutral-100">
              Campus Vehicle Fleet
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Direct peer-to-peer student bike rentals across IBS Academic Blocks & Hostels.
            </p>
          </div>

          {/* Quick status tabs & View Mode */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-900 border border-neutral-800">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === 'ALL'
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                All ({bikesList.length})
              </button>
              <button
                onClick={() => setStatusFilter('AVAILABLE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  statusFilter === 'AVAILABLE'
                    ? 'bg-emerald-500 text-neutral-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Available</span>
              </button>
            </div>

            {/* Grid / List View Toggle */}
            <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-neutral-900 border border-neutral-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-neutral-800 text-amber-400' : 'text-neutral-500 hover:text-neutral-300'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-neutral-800 text-amber-400' : 'text-neutral-500 hover:text-neutral-300'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar Panel */}
      <div className="p-5 rounded-2xl glass-panel space-y-4">
        {/* Search input row */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
            <input
              id="bike-search-input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by model, brand, hub location, or owner name (e.g. Hunter 350, MT-15, IBS Hub)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500/80 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-4 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-amber-400 flex items-center justify-center gap-2 transition-colors self-end md:self-auto focus-ring"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Detailed Filters row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 border-t border-neutral-800/80">
          {/* Brand Filter */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-amber-400/90 uppercase tracking-wider mb-1">
              Brand
            </label>
            <select
              id="filter-brand-select"
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500/80"
            >
              <option value="ALL">All Brands</option>
              {uniqueBrands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Bike Type Filter */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-amber-400/90 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              id="filter-type-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500/80"
            >
              <option value="ALL">All Categories</option>
              {uniqueTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Campus Hub */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-amber-400/90 uppercase tracking-wider mb-1">
              Campus Hub
            </label>
            <select
              id="filter-hub-select"
              value={hubFilter}
              onChange={(e) => setHubFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500/80"
            >
              <option value="ALL">All Campus Hubs</option>
              {uniqueHubs.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>

          {/* Transmission */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-amber-400/90 uppercase tracking-wider mb-1">
              Transmission
            </label>
            <select
              id="filter-transmission-select"
              value={transmissionFilter}
              onChange={(e) => setTransmissionFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500/80"
            >
              <option value="ALL">All Types</option>
              <option value="Manual">Manual Geared</option>
              <option value="Automatic">Automatic (Scooter/EV)</option>
            </select>
          </div>

          {/* Fuel Type */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-amber-400/90 uppercase tracking-wider mb-1">
              Power Engine
            </label>
            <select
              id="filter-fuel-select"
              value={fuelFilter}
              onChange={(e) => setFuelFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500/80"
            >
              <option value="ALL">All Fuel Types</option>
              <option value="Petrol">Petrol</option>
              <option value="Electric">Electric EV</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-amber-400/90 uppercase tracking-wider mb-1">
              <span>Max Rate</span>
              <span className="font-mono text-neutral-200">₹{maxPrice}/day</span>
            </div>
            <input
              id="filter-price-slider"
              type="range"
              min="300"
              max="1500"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer mt-1"
            />
          </div>
        </div>
      </div>

      {/* Results Header / Active Filters summary */}
      <div className="flex items-center justify-between text-xs text-neutral-400">
        <span>
          Showing <strong className="text-neutral-100 font-semibold">{filteredBikes.length}</strong> matching vehicles
        </span>
      </div>

      {/* Bike Cards Results */}
      {filteredBikes.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBikes.map((bike) => (
              <BikeCard
                key={bike.id}
                bike={bike}
                onSelect={handleSelect}
                onBookNow={handleBook}
              />
            ))}
          </div>
        ) : (
          /* List View for fast comparison */
          <div className="space-y-3">
            {filteredBikes.map((bike) => {
              const isAvailable = bike.availabilityStatus === 'AVAILABLE';
              return (
                <div
                  key={bike.id}
                  className="p-4 rounded-2xl glass-card flex flex-col md:flex-row items-center justify-between gap-4 hover:border-amber-500/40 transition-all"
                >
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <img
                      src={bike.images?.[0] || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=400&q=80'}
                      alt={bike.model}
                      className="w-24 h-16 rounded-xl object-cover shrink-0 bg-neutral-950"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                          {bike.brand}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-950 border border-neutral-800 text-neutral-300">
                          {bike.bikeType}
                        </span>
                      </div>
                      <h3
                        onClick={() => handleSelect(bike)}
                        className="font-display font-bold text-base text-neutral-100 hover:text-amber-300 cursor-pointer"
                      >
                        {bike.model}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-neutral-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-400" />
                          {bike.pickupHub}
                        </span>
                        <span>•</span>
                        <span>Host: {bike.ownerName || 'Peer'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-neutral-800">
                    <div className="text-left md:text-right">
                      <div className="font-display font-bold text-lg text-neutral-100">
                        ₹{bike.pricePerDay}
                        <span className="text-xs font-normal text-neutral-400"> / 24 hrs</span>
                      </div>
                      <span className="text-[10px] text-neutral-400">₹{bike.securityDeposit} deposit</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSelect(bike)}
                        className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-neutral-200"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleBook(bike)}
                        disabled={!isAvailable}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                          isAvailable
                            ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-md shadow-amber-500/20'
                            : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                        }`}
                      >
                        <span>{isAvailable ? 'Book' : 'Reserved'}</span>
                        {isAvailable && <ArrowRight className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        <div className="p-16 rounded-3xl glass-card text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-400 flex items-center justify-center mx-auto">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-neutral-200">
            No matching campus bikes found
          </h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Try adjusting your search criteria, price range, or category filter to discover other available student rides.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
