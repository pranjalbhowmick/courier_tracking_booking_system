import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Package, CheckCircle, XCircle, Truck, RefreshCw, Users } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StatusBadge from '../components/StatusBadge';
import { useAppStore } from '../store/appStore';
import type { ShipmentStatus } from '../types';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }),
};

const SHIPMENT_STATUSES: ShipmentStatus[] = ['Approved', 'In Transit', 'Delivered'];

const AdminPanel: React.FC = () => {
  const { bookings, shipments, approveBooking, rejectBooking, updateShipmentStatus } = useAppStore();
  const [activeTab, setActiveTab] = useState<'bookings' | 'shipments'>('bookings');

  const handleApprove = (id: string) => {
    approveBooking(id);
    toast.success('Booking approved and tracking number generated.');
  };

  const handleReject = (id: string) => {
    rejectBooking(id);
    toast.error('Booking rejected.');
  };

  const handleStatusUpdate = (shipmentId: string, status: ShipmentStatus) => {
    updateShipmentStatus(shipmentId, status);
    toast.success(`Shipment status updated to "${status}".`);
  };

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: Package, color: 'text-amber-400', bg: 'bg-amber-500/15' },
    { label: 'Pending', value: bookings.filter(b => b.status === 'Pending').length, icon: RefreshCw, color: 'text-yellow-400', bg: 'bg-yellow-500/15' },
    { label: 'Active Shipments', value: shipments.filter(s => s.status !== 'Delivered').length, icon: Truck, color: 'text-blue-400', bg: 'bg-blue-500/15' },
    { label: 'Customers', value: new Set(bookings.map(b => b.customerId)).size, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
              <Shield size={20} className="text-amber-400" />
            </div>
            <div>
              <h1 className="font-heading text-3xl font-bold text-white">Admin Panel</h1>
              <p className="text-slate-400 text-sm">Manage all bookings and shipments</p>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial="hidden"
                animate="visible"
                custom={i}
                variants={fadeUp}
                className="p-6 rounded-2xl bg-slate-900 border border-white/10"
              >
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
                  <stat.icon size={20} className={stat.color} />
                </div>
                <p className="font-heading text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {(['bookings', 'shipments'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 capitalize ${
                  activeTab === tab
                    ? 'bg-amber-500 text-slate-900'
                    : 'bg-slate-900 text-slate-400 border border-white/10 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab === 'bookings' ? 'All Bookings' : 'Shipments'}
              </button>
            ))}
          </div>

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl bg-slate-900 border border-white/10 overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-white/10">
                <h2 className="font-heading text-lg font-bold text-white">All Customer Bookings</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Booking ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Receiver</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Package</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Weight</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Tracking #</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {bookings.map((booking, i) => (
                      <motion.tr
                        key={booking.id}
                        initial="hidden"
                        animate="visible"
                        custom={i}
                        variants={fadeUp}
                        className="hover:bg-white/5 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 text-sm font-mono text-amber-400">{booking.id}</td>
                        <td className="px-6 py-4 text-sm text-slate-300">{booking.customerName}</td>
                        <td className="px-6 py-4 text-sm text-white font-medium">{booking.receiverName}</td>
                        <td className="px-6 py-4 text-sm text-slate-300">{booking.packageType}</td>
                        <td className="px-6 py-4 text-sm text-slate-300">{booking.packageWeight} kg</td>
                        <td className="px-6 py-4"><StatusBadge status={booking.status} /></td>
                        <td className="px-6 py-4 text-sm font-mono text-slate-400">
                          {booking.trackingNumber ?? <span className="text-slate-600">—</span>}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">
                          {format(new Date(booking.createdAt), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4">
                          {booking.status === 'Pending' ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApprove(booking.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-medium hover:bg-emerald-500/25 transition-all duration-200"
                              >
                                <CheckCircle size={14} />
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(booking.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 border border-red-500/30 text-xs font-medium hover:bg-red-500/25 transition-all duration-200"
                              >
                                <XCircle size={14} />
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-600 text-xs">—</span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Shipments Tab */}
          {activeTab === 'shipments' && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl bg-slate-900 border border-white/10 overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-white/10">
                <h2 className="font-heading text-lg font-bold text-white">Shipment Management</h2>
              </div>
              {shipments.length === 0 ? (
                <div className="py-20 text-center">
                  <Truck size={48} className="text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-400">No shipments yet. Approve bookings to generate shipments.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Tracking #</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Booking ID</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Sender</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Receiver</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Created</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Update Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {shipments.map((shipment, i) => (
                        <motion.tr
                          key={shipment.id}
                          initial="hidden"
                          animate="visible"
                          custom={i}
                          variants={fadeUp}
                          className="hover:bg-white/5 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 text-sm font-mono text-amber-400 font-semibold">{shipment.trackingNumber}</td>
                          <td className="px-6 py-4 text-sm font-mono text-slate-400">{shipment.bookingId}</td>
                          <td className="px-6 py-4 text-sm text-slate-300">{shipment.senderName}</td>
                          <td className="px-6 py-4 text-sm text-white font-medium">{shipment.receiverName}</td>
                          <td className="px-6 py-4"><StatusBadge status={shipment.status} /></td>
                          <td className="px-6 py-4 text-sm text-slate-400">
                            {format(new Date(shipment.createdAt), 'MMM d, yyyy')}
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={shipment.status}
                              onChange={e => handleStatusUpdate(shipment.id, e.target.value as ShipmentStatus)}
                              className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all duration-200"
                            >
                              {SHIPMENT_STATUSES.map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPanel;