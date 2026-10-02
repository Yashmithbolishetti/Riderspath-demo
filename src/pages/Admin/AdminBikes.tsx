import React, { useState, useEffect, useRef } from 'react';
import { Bike } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { hourlyToDaily, dailyToHourly, PRICING_HELPER_TEXT } from '../../utils/pricing';
import { triggerHaptic } from '../../utils/haptics';
import { EnrollmentNumberInput } from '../../components/EnrollmentNumberInput';
import {
  Bike as BikeIcon,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Search,
  Upload,
  X,
  MapPin,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Star,
} from 'lucide-react';

export const AdminBikes: React.FC = () => {
  const { showToast } = useAuth();
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBike, setEditingBike] = useState<Bike | null>(null);

  // Form fields
  const [brand, setBrand] = useState('Royal Enfield');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(2023);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [bikeType, setBikeType] = useState('Cruiser');
  const [fuelType, setFuelType] = useState('Petrol');
  const [transmission, setTransmission] = useState('Manual');
  const [pickupHub, setPickupHub] = useState('IBS Academic Block Hub');
  
  // Pricing state
  const [pricePerDay, setPricePerDay] = useState(550);
  const [pricePerHour, setPricePerHour] = useState(23);
  const [securityDeposit, setSecurityDeposit] = useState(1000);
  
  const [availabilityStatus, setAvailabilityStatus] = useState<
    'AVAILABLE' | 'RESERVED' | 'MAINTENANCE' | 'UNAVAILABLE'
  >('AVAILABLE');
  const [ownerName, setOwnerName] = useState('Admin Staff');
  const [ownerEnrollment, setOwnerEnrollment] = useState('26FMUCHH01XXXX');
  const [ownerPhone, setOwnerPhone] = useState('+91 98490 21000');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [displayRegistrationToPublic, setDisplayRegistrationToPublic] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchBikes = async () => {
    try {
      setLoading(true);
      const data = await api.getAllBikesAdmin();
      setBikes(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load fleet', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBikes();
  }, []);

  const openAddModal = () => {
    triggerHaptic('light');
    setEditingBike(null);
    setBrand('Royal Enfield');
    setModel('');
    setYear(2023);
    setRegistrationNumber('');
    setBikeType('Cruiser');
    setFuelType('Petrol');
    setTransmission('Manual');
    setPickupHub('IBS Academic Block Hub');
    setPricePerDay(550);
    setPricePerHour(dailyToHourly(550));
    setSecurityDeposit(1000);
    setAvailabilityStatus('AVAILABLE');
    setOwnerName('Admin Staff');
    setOwnerEnrollment('26FMUCHH01XXXX');
    setOwnerPhone('+91 98490 21000');
    setDescription('');
    setImages(['https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80']);
    setCustomImageUrl('');
    setDisplayRegistrationToPublic(false);
    setModalOpen(true);
  };

  const openEditModal = (bike: Bike) => {
    triggerHaptic('light');
    setEditingBike(bike);
    setBrand(bike.brand);
    setModel(bike.model);
    setYear(bike.year);
    setRegistrationNumber(bike.registrationNumber);
    setBikeType(bike.bikeType);
    setFuelType(bike.fuelType);
    setTransmission(bike.transmission);
    setPickupHub(bike.pickupHub);
    
    const dayP = bike.pricePerDay;
    const hrP = bike.pricePerHour && bike.pricePerHour > 0 ? bike.pricePerHour : dailyToHourly(dayP);
    setPricePerDay(dayP);
    setPricePerHour(hrP);

    setSecurityDeposit(bike.securityDeposit);
    setAvailabilityStatus(bike.availabilityStatus);
    setOwnerName(bike.ownerName);
    setOwnerEnrollment(bike.ownerEnrollment || '26FMUCHH01XXXX');
    setOwnerPhone(bike.ownerPhone);
    setDescription(bike.description);
    setImages(bike.images && bike.images.length > 0 ? [...bike.images] : []);
    setCustomImageUrl('');
    setDisplayRegistrationToPublic(Boolean(bike.displayRegistrationToPublic));
    setModalOpen(true);
  };

  // Bidirectional Price Handlers
  const handleDailyPriceChange = (valStr: string) => {
    const val = Number(valStr);
    if (isNaN(val)) {
      setPricePerDay(0);
      setPricePerHour(0);
      return;
    }
    setPricePerDay(val);
    setPricePerHour(dailyToHourly(val));
  };

  const handleHourlyPriceChange = (valStr: string) => {
    const val = Number(valStr);
    if (isNaN(val)) {
      setPricePerHour(0);
      setPricePerDay(0);
      return;
    }
    setPricePerHour(val);
    setPricePerDay(hourlyToDaily(val));
  };

  // Image Upload & Management Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file (PNG, JPG, WEBP)', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          setImages((prev) => [...prev, base64]);
          triggerHaptic('light');
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset file input so same file can be uploaded again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddCustomUrl = () => {
    if (!customImageUrl.trim()) return;
    setImages((prev) => [...prev, customImageUrl.trim()]);
    setCustomImageUrl('');
    triggerHaptic('light');
    showToast('Image URL added', 'success');
  };

  const handleRemoveImage = (index: number) => {
    triggerHaptic('warning');
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetPrimaryImage = (index: number) => {
    if (index === 0) return;
    triggerHaptic('light');
    setImages((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      copy.unshift(item);
      return copy;
    });
  };

  const handleSaveBike = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('medium');

    const finalImages =
      images.length > 0
        ? images
        : ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'];

    try {
      if (editingBike) {
        await api.updateBike(editingBike.id, {
          brand,
          model,
          year: Number(year),
          registrationNumber: registrationNumber.toUpperCase(),
          bikeType,
          fuelType,
          transmission,
          pickupHub,
          pricePerDay: Number(pricePerDay),
          pricePerHour: Number(pricePerHour) || dailyToHourly(Number(pricePerDay)),
          securityDeposit: Number(securityDeposit),
          availabilityStatus,
          ownerName,
          ownerEnrollment: ownerEnrollment.toUpperCase(),
          ownerPhone,
          description,
          images: finalImages,
          displayRegistrationToPublic,
        });
        triggerHaptic('success');
        showToast('Vehicle updated successfully!', 'success');
      } else {
        await api.createBike({
          brand,
          model,
          year: Number(year),
          registrationNumber: registrationNumber.toUpperCase(),
          bikeType,
          fuelType,
          transmission,
          pickupHub,
          pricePerDay: Number(pricePerDay),
          pricePerHour: Number(pricePerHour) || dailyToHourly(Number(pricePerDay)),
          securityDeposit: Number(securityDeposit),
          availabilityStatus,
          ownerName,
          ownerEnrollment: ownerEnrollment.toUpperCase(),
          ownerPhone,
          description,
          images: finalImages,
          displayRegistrationToPublic,
          approvedByAdmin: true,
          active: true,
        });
        triggerHaptic('success');
        showToast('New vehicle added to campus fleet!', 'success');
      }
      setModalOpen(false);
      fetchBikes();
    } catch (err: any) {
      triggerHaptic('error');
      showToast(err.message || 'Failed to save vehicle', 'error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    triggerHaptic('warning');
    if (!window.confirm(`Are you sure you want to remove ${name} from the fleet?`)) return;
    try {
      await api.deleteBike(id);
      triggerHaptic('success');
      showToast('Bike removed from system', 'info');
      fetchBikes();
    } catch (err: any) {
      triggerHaptic('error');
      showToast(err.message || 'Failed to delete bike', 'error');
    }
  };

  const handleQuickStatusToggle = async (bike: Bike, newStatus: any) => {
    triggerHaptic('light');
    try {
      await api.updateBike(bike.id, { availabilityStatus: newStatus });
      showToast(`Status updated to ${newStatus}`, 'success');
      fetchBikes();
    } catch (err: any) {
      showToast('Failed to update status', 'error');
    }
  };

  const filteredBikes = (bikes || []).filter(
    (b) =>
      b &&
      ((b.brand || '').toLowerCase().includes(search.toLowerCase()) ||
        (b.model || '').toLowerCase().includes(search.toLowerCase()) ||
        (b.registrationNumber || '').toLowerCase().includes(search.toLowerCase()) ||
        (b.ownerEnrollment || '').toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-neutral-100">
            Campus Fleet Inventory
          </h2>
          <p className="text-xs text-neutral-400">
            Total {bikes.length} bikes registered across ICFAI campus hubs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search fleet..."
              className="pl-9 pr-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          <button
            id="admin-add-bike-btn"
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* Fleet Table */}
      <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 font-mono uppercase text-[10px] border-b border-neutral-800">
              <tr>
                <th className="px-4 py-3.5">Vehicle</th>
                <th className="px-4 py-3.5">Owner / Host</th>
                <th className="px-4 py-3.5">Campus Hub</th>
                <th className="px-4 py-3.5">Pricing</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {filteredBikes.map((bike) => (
                <tr key={bike.id} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={bike.images?.[0] || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=300&q=80'}
                        alt={bike.model}
                        className="w-12 h-10 rounded-lg object-cover bg-neutral-950 border border-neutral-800 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="font-semibold text-neutral-100 block">
                          {bike.brand} {bike.model}
                        </span>
                        <span className="font-mono text-[11px] text-amber-400">
                          {bike.registrationNumber}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div>
                      <span className="font-medium text-neutral-200 block">{bike.ownerName}</span>
                      <span className="font-mono text-[11px] text-neutral-400">
                        {bike.ownerEnrollment}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 text-neutral-300">{bike.pickupHub}</td>

                  <td className="px-4 py-3.5 font-mono">
                    <div className="font-bold text-neutral-100">
                      ₹{bike.pricePerDay}
                      <span className="text-[10px] text-neutral-400 font-normal">/day</span>
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      ₹{bike.pricePerHour || dailyToHourly(bike.pricePerDay)}
                      <span className="text-[9px] text-neutral-500">/hr</span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <select
                      value={bike.availabilityStatus}
                      onChange={(e) => handleQuickStatusToggle(bike, e.target.value)}
                      className={`px-2 py-1 rounded-lg text-xs font-semibold border ${
                        bike.availabilityStatus === 'AVAILABLE'
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                          : bike.availabilityStatus === 'RESERVED'
                          ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                          : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                      }`}
                    >
                      <option value="AVAILABLE">AVAILABLE</option>
                      <option value="RESERVED">RESERVED</option>
                      <option value="MAINTENANCE">MAINTENANCE</option>
                      <option value="UNAVAILABLE">UNAVAILABLE</option>
                    </select>
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(bike)}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                        title="Edit Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(bike.id, `${bike.brand} ${bike.model}`)}
                        className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 transition-colors"
                        title="Delete Vehicle"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-display font-bold text-lg text-neutral-100">
                {editingBike ? 'Edit Campus Vehicle' : 'Add New Bike to Fleet'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBike} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Model</label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Registration No.
                  </label>
                  <input
                    type="text"
                    required
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase())}
                    placeholder="TS 08 HG 7721"
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 font-mono uppercase focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Category</label>
                  <select
                    value={bikeType}
                    onChange={(e) => setBikeType(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500/60"
                  >
                    <option value="Cruiser">Cruiser</option>
                    <option value="Street">Street</option>
                    <option value="Sport">Sport</option>
                    <option value="Electric">Electric</option>
                    <option value="Scooter">Scooter</option>
                    <option value="Commuter">Commuter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Status</label>
                  <select
                    value={availabilityStatus}
                    onChange={(e) => setAvailabilityStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500/60"
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="RESERVED">RESERVED</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                    <option value="UNAVAILABLE">UNAVAILABLE</option>
                  </select>
                </div>
              </div>

              {/* Bidirectional Pricing Section */}
              <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-200">Pricing & Security</span>
                  <span className="text-[10px] font-mono text-amber-400">1 Day = 24 Hours Sync</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Price / Day (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={pricePerDay || ''}
                      onChange={(e) => handleDailyPriceChange(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-100 font-mono focus:outline-none focus:border-amber-500/60"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Price / Hour (₹)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={pricePerHour || ''}
                      onChange={(e) => handleHourlyPriceChange(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-100 font-mono focus:outline-none focus:border-amber-500/60"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Security Deposit (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={securityDeposit}
                      onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-100 font-mono focus:outline-none focus:border-amber-500/60"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-neutral-400 pt-1">
                  {PRICING_HELPER_TEXT}
                </p>
              </div>

              {/* Owner Information */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Owner Name
                  </label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Owner Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 font-mono focus:outline-none focus:border-amber-500/60"
                  />
                </div>
                <div>
                  <EnrollmentNumberInput
                    id="admin-bike-owner-enrollment"
                    value={ownerEnrollment}
                    onChange={(val) => setOwnerEnrollment(val)}
                    label="Owner ICFAI Enrollment"
                    required
                    showHelpText={false}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Campus Pickup Hub
                </label>
                <input
                  type="text"
                  required
                  value={pickupHub}
                  onChange={(e) => setPickupHub(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              {/* Vehicle Image Upload & Gallery */}
              <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-500" />
                    Vehicle Images ({images.length})
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    First image is used as primary catalog cover
                  </span>
                </div>

                {/* Image Thumbnails */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative group rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 aspect-video"
                      >
                        <img
                          src={img}
                          alt={`Bike image ${idx + 1}`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {idx === 0 && (
                          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-amber-500 text-neutral-950 font-bold text-[9px] flex items-center gap-0.5 shadow">
                            <Star className="w-2.5 h-2.5 fill-current" /> Cover
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              className="p-1 rounded bg-neutral-800 text-neutral-200 text-[10px] font-medium hover:bg-neutral-700"
                              title="Set as Cover"
                            >
                              Make Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-1 rounded bg-rose-900/80 text-rose-200 hover:bg-rose-800"
                            title="Remove Image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2.5 px-3 rounded-xl border border-dashed border-neutral-700 hover:border-amber-500/60 bg-neutral-900/60 hover:bg-neutral-800 text-xs text-neutral-300 font-medium flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>Upload Photos from Device</span>
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      placeholder="Paste image URL..."
                      className="flex-1 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500/60"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomUrl}
                      className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 font-medium"
                    >
                      Add URL
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="displayRegToggle"
                  checked={displayRegistrationToPublic}
                  onChange={(e) => setDisplayRegistrationToPublic(e.target.checked)}
                  className="accent-amber-500 w-4 h-4 rounded cursor-pointer"
                />
                <label htmlFor="displayRegToggle" className="text-xs text-neutral-300 cursor-pointer">
                  Display exact registration number on public catalog cards
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-medium hover:bg-neutral-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all active:scale-95"
                >
                  {editingBike ? 'Update Vehicle' : 'Save New Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
