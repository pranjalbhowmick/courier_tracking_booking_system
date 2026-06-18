import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Booking, Shipment, AuthState } from '../types';

const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alice Johnson', email: 'alice@example.com', password: 'password123', role: 'customer' },
  { id: 'u2', name: 'Bob Smith', email: 'bob@example.com', password: 'password123', role: 'customer' },
  { id: 'admin1', name: 'Admin User', email: 'admin@swiftcourier.com', password: 'admin123', role: 'admin' },
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-1001',
    customerId: 'u1',
    customerName: 'Alice Johnson',
    senderName: 'Alice Johnson',
    senderPhone: '+1-555-0101',
    receiverName: 'Charlie Brown',
    receiverPhone: '+1-555-0202',
    packageType: 'Document',
    packageWeight: 0.5,
    status: 'Approved',
    createdAt: '2026-01-10T09:00:00Z',
    trackingNumber: 'TRK-1001',
  },
  {
    id: 'BK-1002',
    customerId: 'u1',
    customerName: 'Alice Johnson',
    senderName: 'Alice Johnson',
    senderPhone: '+1-555-0101',
    receiverName: 'Diana Prince',
    receiverPhone: '+1-555-0303',
    packageType: 'Electronics',
    packageWeight: 2.3,
    status: 'Pending',
    createdAt: '2026-01-12T11:30:00Z',
  },
  {
    id: 'BK-1003',
    customerId: 'u2',
    customerName: 'Bob Smith',
    senderName: 'Bob Smith',
    senderPhone: '+1-555-0404',
    receiverName: 'Eve Wilson',
    receiverPhone: '+1-555-0505',
    packageType: 'Parcel',
    packageWeight: 5.0,
    status: 'Approved',
    createdAt: '2026-01-08T14:00:00Z',
    trackingNumber: 'TRK-1002',
  },
  {
    id: 'BK-1004',
    customerId: 'u2',
    customerName: 'Bob Smith',
    senderName: 'Bob Smith',
    senderPhone: '+1-555-0404',
    receiverName: 'Frank Castle',
    receiverPhone: '+1-555-0606',
    packageType: 'Fragile',
    packageWeight: 1.2,
    status: 'Rejected',
    createdAt: '2026-01-09T10:00:00Z',
  },
];

const INITIAL_SHIPMENTS: Shipment[] = [
  {
    id: 'SH-1',
    bookingId: 'BK-1001',
    trackingNumber: 'TRK-1001',
    status: 'In Transit',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-11T08:00:00Z',
    receiverName: 'Charlie Brown',
    senderName: 'Alice Johnson',
  },
  {
    id: 'SH-2',
    bookingId: 'BK-1003',
    trackingNumber: 'TRK-1002',
    status: 'Delivered',
    createdAt: '2026-01-08T15:00:00Z',
    updatedAt: '2026-01-10T12:00:00Z',
    receiverName: 'Eve Wilson',
    senderName: 'Bob Smith',
  },
];

let trackingCounter = 1003;

interface AppStore extends AuthState {
  users: User[];
  bookings: Booking[];
  shipments: Shipment[];
  login: (email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  register: (name: string, email: string, password: string) => { success: boolean; message: string };
  createBooking: (data: Omit<Booking, 'id' | 'customerId' | 'customerName' | 'status' | 'createdAt'>) => void;
  approveBooking: (bookingId: string) => void;
  rejectBooking: (bookingId: string) => void;
  updateShipmentStatus: (shipmentId: string, status: Shipment['status']) => void;
  getShipmentByTracking: (trackingNumber: string) => Shipment | undefined;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      users: MOCK_USERS,
      bookings: INITIAL_BOOKINGS,
      shipments: INITIAL_SHIPMENTS,

      login: (email, password) => {
        const user = get().users.find(u => u.email === email && u.password === password);
        if (!user) return { success: false, message: 'Invalid email or password.' };
        set({ user, isAuthenticated: true });
        return { success: true, message: 'Login successful.' };
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      register: (name, email, password) => {
        const exists = get().users.find(u => u.email === email);
        if (exists) return { success: false, message: 'Email already registered.' };
        const newUser: User = {
          id: `u${Date.now()}`,
          name,
          email,
          password,
          role: 'customer',
        };
        set(state => ({ users: [...state.users, newUser], user: newUser, isAuthenticated: true }));
        return { success: true, message: 'Account created successfully.' };
      },

      createBooking: (data) => {
        const { user } = get();
        if (!user) return;
        const newBooking: Booking = {
          ...data,
          id: `BK-${Date.now()}`,
          customerId: user.id,
          customerName: user.name,
          status: 'Pending',
          createdAt: new Date().toISOString(),
        };
        set(state => ({ bookings: [...state.bookings, newBooking] }));
      },

      approveBooking: (bookingId) => {
        const trackingNumber = `TRK-${trackingCounter++}`;
        set(state => ({
          bookings: state.bookings.map(b =>
            b.id === bookingId ? { ...b, status: 'Approved', trackingNumber } : b
          ),
          shipments: [
            ...state.shipments,
            {
              id: `SH-${Date.now()}`,
              bookingId,
              trackingNumber,
              status: 'Approved',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              receiverName: state.bookings.find(b => b.id === bookingId)?.receiverName ?? '',
              senderName: state.bookings.find(b => b.id === bookingId)?.senderName ?? '',
            },
          ],
        }));
      },

      rejectBooking: (bookingId) => {
        set(state => ({
          bookings: state.bookings.map(b =>
            b.id === bookingId ? { ...b, status: 'Rejected' } : b
          ),
        }));
      },

      updateShipmentStatus: (shipmentId, status) => {
        set(state => ({
          shipments: state.shipments.map(s =>
            s.id === shipmentId ? { ...s, status, updatedAt: new Date().toISOString() } : s
          ),
        }));
      },

      getShipmentByTracking: (trackingNumber) => {
        return get().shipments.find(s => s.trackingNumber === trackingNumber);
      },
    }),
    {
      name: 'swift-courier-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        users: state.users,
        bookings: state.bookings,
        shipments: state.shipments,
      }),
    }
  )
);