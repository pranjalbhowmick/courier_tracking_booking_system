import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, MapPin, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StatusBadge from '../components/StatusBadge';
import { useAppStore } from '../store/appStore';
import type { ShipmentStatus } from '../types';

const WORKFLOW: ShipmentStatus[] = ['Pending', 'Approved', 'In Transit', 'Delivered'];

const STEP_ICONS = {
  Pending: Clock,
  Approved: CheckCircle,
  'In Transit': Truck,
  Delivered: MapPin,
};

const Track: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const { getShipmentByTracking } = useAppStore();
  const [result, setResult] = useState<ReturnType<typeof getShipmentByTracking>>(undefined);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const shipment = getShipmentByTracking(query.trim().toUpperCase());
    setResult(shipment);
    setSearched(true);
  };

  const currentStepIndex = result ? WORKFLOW.indexOf(result.status) : -1;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="py-16 bg-slate-900 border-b border-white/10">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Package size={32} className="text-amber-400" />
              </div>
              <h1 className="font-heading text-4xl font-bold text-white mb-3">Track Your Shipment</h1>
              <p className="text-slate-400 text-lg mb-10">
                Enter your tracking number to get real-time status updates on your package.
              </p>

              <form onSubmit={handleSearch} className="flex gap-3 max-w-xl mx-auto">
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="e.g. TRK-1001"
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200"
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 rounded-xl bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400 hover:scale-105 transition-all duration-200"
                >
                  Track
                </button>
              </form>

              <p className="text-slate-500 text-xs mt-4">Try: TRK-1001 or TRK-1002</p>
            </motion.div>
          </div>
        </section>

        {/* Results */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-6">
            {!searched && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Truck size={64} className="text-slate-800 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">Enter a tracking number above to see shipment details.</p>
              </motion.div>
            )}

            {searched && !result && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 rounded-2xl bg-slate-900 border border-red-500/20 text-center"
              >
                <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
                <h2 className="font-heading text-xl font-bold text-white mb-2">Shipment Not Found</h2>
                <p className="text-slate-400 text-sm">
                  No shipment found for tracking number <strong className="text-white">{query}</strong>.
                  Please verify the number and try again.
                </p>
              </motion.div>
            )}

            {searched && result && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* Summary Card */}
                <div className="p-8 rounded-2xl bg-slate-900 border border-white/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <p className="text-slate-400 text-sm mb-1">Tracking Number</p>
                      <p className="font-heading text-2xl font-bold text-amber-400">{result.trackingNumber}</p>
                    </div>
                    <StatusBadge status={result.status} />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-slate-400 text-xs mb-1">Sender</p>
                      <p className="text-white text-sm font-medium">{result.senderName}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs mb-1">Receiver</p>
                      <p className="text-white text-sm font-medium">{result.receiverName}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs mb-1">Created</p>
                      <p className="text-white text-sm font-medium">{format(new Date(result.createdAt), 'MMM d, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs mb-1">Last Updated</p>
                      <p className="text-white text-sm font-medium">{format(new Date(result.updatedAt), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="p-8 rounded-2xl bg-slate-900 border border-white/10">
                  <h2 className="font-heading text-lg font-bold text-white mb-8">Shipment Progress</h2>
                  <div className="relative">
                    <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-slate-800" />
                    <div className="space-y-6">
                      {WORKFLOW.map((step, i) => {
                        const isCompleted = i <= currentStepIndex;
                        const isCurrent = i === currentStepIndex;
                        const Icon = STEP_ICONS[step];
                        return (
                          <motion.div
                            key={step}
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.3 }}
                            className="relative flex items-start gap-5"
                          >
                            <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                              isCurrent
                                ? 'bg-amber-500 shadow-lg shadow-amber-500/30'
                                : isCompleted
                                ? 'bg-emerald-500/20 border border-emerald-500/40'
                                : 'bg-slate-800 border border-slate-700'
                            }`}>
                              <Icon size={18} className={
                                isCurrent ? 'text-slate-900' : isCompleted ? 'text-emerald-400' : 'text-slate-600'
                              } />
                            </div>
                            <div className="pt-1.5">
                              <p className={`font-semibold text-sm ${
                                isCurrent ? 'text-amber-400' : isCompleted ? 'text-white' : 'text-slate-600'
                              }`}>
                                {step}
                                {isCurrent && <span className="ml-2 text-xs font-normal text-amber-400/70">Current</span>}
                              </p>
                              <p className="text-slate-500 text-xs mt-0.5">
                                {isCompleted
                                  ? isCurrent
                                    ? `Updated ${format(new Date(result.updatedAt), 'MMM d, yyyy')}`
                                    : 'Completed'
                                  : 'Pending'}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Track;