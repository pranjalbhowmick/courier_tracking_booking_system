import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { format } from 'date-fns';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StatusBadge from '../components/StatusBadge';
import BookingModal from '../components/BookingModal';
import { useAppStore } from '../store/appStore';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

const Dashboard: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { user, bookings } = useAppStore();
  const myBookings = bookings.filter(b => b.customerId === user?.id);

  const stats = [
    { label: 'Total Bookings', value: myBookings.length, icon: Package, color: 'text-amber-400', bg: 'bg-amber-500/15' },
    { label: 'Pending', value: myBookings.filter(b => b.status === 'Pending').length, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/15' },
    { label: 'Approved', value: myBookings.filter(b => b.status === 'Approved').length, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
    { label: 'Rejected', value: myBookings.filter(b => b.status === 'Rejected').length, icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/15' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10"
          >
            <div>
              <h1 className="font-heading text-3xl font-bold text-white mb-1">My Dashboard</h1>
              <p className="text-slate-400 text-sm">Welcome back, <span className="text-amber-400">{user?.name}</span></p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-slate-900 font-semibold text-sm hover:bg-amber-400 hover:scale-105 transition-all duration-200"
            >
              <Plus size={18} />
              New Booking
            </button>
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

          {/* Bookings Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="rounded-2xl bg-slate-900 border border-white/10 overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-white/10 flex items-center gap-3">
              <Truck size={20} className="text-amber-400" />
              <h2 className="font-heading text-lg font-bold text-white">My Bookings</h2>
            </div>

            {myBookings.length === 0 ? (
              <div className="py-20 text-center">
                <Package size={48} className="text-slate-700 mx-auto mb-4" />
                <p className="text-slate-400 font-medium mb-2">No bookings yet</p>
                <p className="text-slate-500 text-sm mb-6">Create your first booking to get started</p>
                <button
                  onClick={() => setModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-slate-900 font-semibold text-sm hover:bg-amber-400 transition-all duration-200"
                >
                  <Plus size={16} />
                  Create Booking
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Booking ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Receiver</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Package Type</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Weight</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Tracking #</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {myBookings.map((booking, i) => (
                      <motion.tr
                        key={booking.id}
                        initial="hidden"
                        animate="visible"
                        custom={i}
                        variants={fadeUp}
                        className="hover:bg-white/5 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 text-sm font-mono text-amber-400">{booking.id}</td>
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
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
      <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Dashboard;