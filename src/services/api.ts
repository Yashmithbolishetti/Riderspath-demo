import {
  Bike,
  Booking,
  User,
  DocumentVerification,
  DashboardMetrics,
  AdminAction,
  AdminConfig,
  PickupLocation,
  CommunicationLog,
} from '../types';

const API_BASE = '/api';

function getAdminHeaders(): HeadersInit {
  const token = localStorage.getItem('rp_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const api = {
  // Config
  async getConfig(): Promise<AdminConfig> {
    const res = await fetch(`${API_BASE}/config`);
    if (!res.ok) throw new Error('Failed to fetch config');
    return res.json();
  },

  async updateConfig(updates: Partial<AdminConfig>): Promise<AdminConfig> {
    const res = await fetch(`${API_BASE}/config`, {
      method: 'PUT',
      headers: getAdminHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update config');
    return res.json();
  },

  // Admin Auth
  async adminLogin(password: string): Promise<{ success: boolean; token: string }> {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Admin login failed');
    }
    return res.json();
  },

  async adminLogout(): Promise<void> {
    await fetch(`${API_BASE}/admin/logout`, {
      method: 'POST',
      headers: getAdminHeaders(),
    });
    localStorage.removeItem('rp_admin_token');
  },

  async adminChangePassword(oldPassword: string, newPassword: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/change-password`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Password update failed');
    }
  },

  // Student Auth
  async studentLogin(payload: {
    fullName: string;
    email?: string;
    phone?: string;
    icfaiEnrollmentNumber: string;
  }): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Student login failed');
    }
    return res.json();
  },

  async getUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/users`, {
      headers: getAdminHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  async updateUserStatus(userId: string, verificationStatus: string): Promise<User> {
    const res = await fetch(`${API_BASE}/users/${userId}/status`, {
      method: 'PUT',
      headers: getAdminHeaders(),
      body: JSON.stringify({ verificationStatus }),
    });
    if (!res.ok) throw new Error('Failed to update user status');
    return res.json();
  },

  // Bikes
  async getBikes(filters?: {
    status?: string;
    brand?: string;
    bikeType?: string;
    fuelType?: string;
    transmission?: string;
    search?: string;
  }): Promise<Bike[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.set('status', filters.status);
    if (filters?.brand) params.set('brand', filters.brand);
    if (filters?.bikeType) params.set('bikeType', filters.bikeType);
    if (filters?.fuelType) params.set('fuelType', filters.fuelType);
    if (filters?.transmission) params.set('transmission', filters.transmission);
    if (filters?.search) params.set('search', filters.search);

    const res = await fetch(`${API_BASE}/bikes?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch bikes');
    return res.json();
  },

  async getAllBikesAdmin(): Promise<Bike[]> {
    const res = await fetch(`${API_BASE}/bikes/all`, {
      headers: getAdminHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch all bikes');
    return res.json();
  },

  async getBikeById(id: string): Promise<Bike> {
    const res = await fetch(`${API_BASE}/bikes/${id}`);
    if (!res.ok) throw new Error('Bike not found');
    return res.json();
  },

  async checkBikeAvailability(bikeId: string, pickupDate: string, returnDate: string): Promise<{ available: boolean; reason?: string; conflicts?: any[] }> {
    const params = new URLSearchParams({ pickupDate, returnDate });
    const res = await fetch(`${API_BASE}/bikes/${bikeId}/availability?${params.toString()}`);
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to check availability');
    }
    return res.json();
  },

  async createBike(bikeData: Partial<Bike>): Promise<Bike> {
    const res = await fetch(`${API_BASE}/bikes`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify(bikeData),
    });
    if (!res.ok) throw new Error('Failed to create bike');
    return res.json();
  },

  async updateBike(id: string, updates: Partial<Bike>): Promise<Bike> {
    const res = await fetch(`${API_BASE}/bikes/${id}`, {
      method: 'PUT',
      headers: getAdminHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update bike');
    return res.json();
  },

  async deleteBike(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/bikes/${id}`, {
      method: 'DELETE',
      headers: getAdminHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete bike');
  },

  // Owner Onboarding
  async submitOwnerOnboarding(payload: any): Promise<{ success: boolean; message: string; bike: Bike }> {
    const res = await fetch(`${API_BASE}/owner/onboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to submit bike for listing');
    }
    return res.json();
  },

  async getOwnerSubmissions(): Promise<Bike[]> {
    const res = await fetch(`${API_BASE}/owner/submissions`, {
      headers: getAdminHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch owner submissions');
    return res.json();
  },

  async approveOwnerBike(bikeId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/owner/approve/${bikeId}`, {
      method: 'POST',
      headers: getAdminHeaders(),
    });
    if (!res.ok) throw new Error('Failed to approve bike');
  },

  async rejectOwnerBike(bikeId: string, reason?: string): Promise<void> {
    const res = await fetch(`${API_BASE}/owner/reject/${bikeId}`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ reason }),
    });
    if (!res.ok) throw new Error('Failed to reject bike');
  },

  async requestOwnerChanges(bikeId: string, notes: string): Promise<void> {
    const res = await fetch(`${API_BASE}/owner/request-changes/${bikeId}`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ notes }),
    });
    if (!res.ok) throw new Error('Failed to request changes');
  },

  // Pickup Locations
  async getPickupLocations(all = false): Promise<PickupLocation[]> {
    const res = await fetch(`${API_BASE}/pickup-locations${all ? '?all=true' : ''}`);
    if (!res.ok) throw new Error('Failed to fetch pickup locations');
    return res.json();
  },

  async adminGetPickupLocations(): Promise<PickupLocation[]> {
    const res = await fetch(`${API_BASE}/admin/pickup-locations`, {
      headers: getAdminHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch admin pickup locations');
    return res.json();
  },

  async adminCreatePickupLocation(locationData: Partial<PickupLocation>): Promise<PickupLocation> {
    const res = await fetch(`${API_BASE}/admin/pickup-locations`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify(locationData),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to create pickup location');
    }
    return res.json();
  },

  async adminUpdatePickupLocation(id: string, updates: Partial<PickupLocation>): Promise<PickupLocation> {
    const res = await fetch(`${API_BASE}/admin/pickup-locations/${id}`, {
      method: 'PUT',
      headers: getAdminHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to update pickup location');
    }
    return res.json();
  },

  async adminDeletePickupLocation(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/pickup-locations/${id}`, {
      method: 'DELETE',
      headers: getAdminHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete pickup location');
  },

  // Fast Handover and Return Actions
  async adminFastHandover(id: string, data?: { notes?: string; coordinatorName?: string }): Promise<{ success: boolean; booking: Booking }> {
    const res = await fetch(`${API_BASE}/admin/bookings/${id}/handover`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify(data || {}),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to process handover');
    }
    return res.json();
  },

  async adminFastReturn(id: string, data?: { notes?: string; coordinatorName?: string }): Promise<{ success: boolean; booking: Booking }> {
    const res = await fetch(`${API_BASE}/admin/bookings/${id}/return`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify(data || {}),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to process return');
    }
    return res.json();
  },

  // Communications
  async getBookingCommunications(bookingId: string): Promise<CommunicationLog[]> {
    const res = await fetch(`${API_BASE}/admin/bookings/${bookingId}/communications`, {
      headers: getAdminHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch communications');
    return res.json();
  },

  async sendBookingEmail(bookingId: string, customMessage?: string): Promise<{ success: boolean; configured: boolean; message: string; preview: any; log: CommunicationLog }> {
    const res = await fetch(`${API_BASE}/admin/bookings/${bookingId}/send-email`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ customMessage }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to send email');
    }
    return res.json();
  },

  async sendBookingWhatsApp(bookingId: string, customMessage?: string): Promise<{ success: boolean; configured: boolean; message: string; waLink?: string; preview: any; log: CommunicationLog }> {
    const res = await fetch(`${API_BASE}/admin/bookings/${bookingId}/send-whatsapp`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ customMessage }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to send WhatsApp message');
    }
    return res.json();
  },

  // Bookings
  async getBookings(renterId?: string, enrollment?: string): Promise<Booking[]> {
    const params = new URLSearchParams();
    if (renterId) params.set('renterId', renterId);
    if (enrollment) params.set('enrollment', enrollment);

    const res = await fetch(`${API_BASE}/bookings?${params.toString()}`, {
      headers: getAdminHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
  },

  async getBookingById(id: string): Promise<Booking> {
    const res = await fetch(`${API_BASE}/bookings/${id}`);
    if (!res.ok) throw new Error('Booking not found');
    return res.json();
  },

  async createBooking(payload: any): Promise<{ success: boolean; booking: Booking; message: string }> {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Booking creation failed');
    }
    return res.json();
  },

  async updateBookingStatus(id: string, updates: Partial<Booking>): Promise<Booking> {
    const res = await fetch(`${API_BASE}/bookings/${id}/status`, {
      method: 'PUT',
      headers: getAdminHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update booking status');
    return res.json();
  },

  async recordPickupInspection(id: string, payload: any): Promise<{ success: boolean; booking: Booking }> {
    const res = await fetch(`${API_BASE}/bookings/${id}/pickup-inspection`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to record pickup inspection');
    }
    return res.json();
  },

  async recordReturnInspection(id: string, payload: any): Promise<{ success: boolean; booking: Booking }> {
    const res = await fetch(`${API_BASE}/bookings/${id}/return-inspection`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to record return inspection');
    }
    return res.json();
  },

  // AI Verification direct test
  async verifyDocumentDirect(payload: {
    documentBase64: string;
    mimeType?: string;
    expectedName: string;
    expectedEnrollment?: string;
    documentCategory: 'aadhar' | 'driving_license' | 'student_id';
  }) {
    const res = await fetch(`${API_BASE}/verify-document`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Verification failed');
    return res.json();
  },

  async getVerifications(): Promise<DocumentVerification[]> {
    const res = await fetch(`${API_BASE}/admin/verifications`, {
      headers: getAdminHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch verifications');
    return res.json();
  },

  async reviewVerification(id: string, result: string, notes?: string): Promise<DocumentVerification> {
    const res = await fetch(`${API_BASE}/admin/verifications/${id}/review`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ result, notes }),
    });
    if (!res.ok) throw new Error('Failed to review verification');
    return res.json();
  },

  // Admin Metrics & Actions
  async getMetrics(): Promise<DashboardMetrics> {
    const res = await fetch(`${API_BASE}/admin/metrics`, {
      headers: getAdminHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard metrics');
    return res.json();
  },

  async getAdminActions(): Promise<AdminAction[]> {
    const res = await fetch(`${API_BASE}/admin/actions`, {
      headers: getAdminHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch admin audit logs');
    return res.json();
  },
};
