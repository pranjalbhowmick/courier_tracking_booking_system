import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package, Search, Truck, Shield, Clock, Star, ArrowRight, CheckCircle, MapPin, Zap
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAppStore } from '../store/appStore';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const Home: React.FC = () => {
  const [trackInput, setTrackInput] = useState('');
  const { getShipmentByTracking } = useAppStore();
  const [trackResult, setTrackResult] = useState<ReturnType<typeof getShipmentByTracking>>(undefined);
  const [trackSearched, setTrackSearched] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const result = getShipmentByTracking(trackInput.trim().toUpperCase());
    setTrackResult(result);
    setTrackSearched(true);
  };

  const features = [
    { icon: Zap, title: 'Express Delivery', desc: 'Same-day and next-day delivery options for urgent shipments.' },
    { icon: MapPin, title: 'Real-Time Tracking', desc: 'Track your package at every step with live status updates.' },
    { icon: Shield, title: 'Secure Handling', desc: 'Insurance coverage and careful handling for all package types.' },
    { icon: Clock, title: '24/7 Support', desc: 'Round-the-clock customer support for all your courier needs.' },
  ];

  const stats = [
    { value: '2M+', label: 'Packages Delivered' },
    { value: '98.7%', label: 'On-Time Rate' },
    { value: '150+', label: 'Cities Covered' },
    { value: '4.9★', label: 'Customer Rating' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600&h=900&fit=crop"
            alt="Courier delivery logistics"
            width={1600}
            height={900}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-sm font-medium mb-8">
              <Truck size={14} />
              Fast & Reliable Courier Services
            </span>
            <h1 className="font-heading text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              Ship Anything,
              <br />
              <span className="text-amber-400">Anywhere.</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Book courier pickups, track shipments in real time, and manage all your deliveries from one powerful dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-amber-500 text-slate-900 font-semibold text-base hover:bg-amber-400 hover:scale-105 transition-all duration-200"
              >
                Book a Courier
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/track"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white font-semibold text-base hover:bg-white/10 hover:border-white/40 transition-all duration-200"
              >
                <Search size={18} />
                Track Shipment
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Track */}
      <section className="py-16 bg-slate-900 border-y border-white/10">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
            className="text-center mb-8"
          >
            <h2 className="font-heading text-2xl font-bold text-white mb-2">Quick Track</h2>
            <p className="text-slate-400 text-sm">Enter your tracking number to get instant status updates</p>
          </motion.div>
          <motion.form
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            variants={fadeUp}
            onSubmit={handleTrack}
            className="flex gap-3"
          >
            <input
              type="text"
              value={trackInput}
              onChange={e => setTrackInput(e.target.value)}
              placeholder="e.g. TRK-1001"
              className="flex-1 px-5 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200"
            />
            <button
              type="submit"
              className="px-8 py-4 rounded-xl bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400 hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <Search size={18} />
              Track
            </button>
          </motion.form>

          {trackSearched && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              {trackResult ? (
                <div className="p-5 rounded-xl bg-slate-800 border border-emerald-500/30">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle size={20} className="text-emerald-400" />
                    <span className="font-semibold text-white">{trackResult.trackingNumber}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400">Status</p>
                      <p className="text-white font-medium">{trackResult.status}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Receiver</p>
                      <p className="text-white font-medium">{trackResult.receiverName}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-xl bg-slate-800 border border-red-500/30 text-center">
                  <p className="text-red-400 text-sm">No shipment found for <strong>{trackInput}</strong>. Please check the tracking number.</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="text-center"
              >
                <p className="font-heading text-4xl font-bold text-amber-400 mb-2">{stat.value}</p>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl font-bold text-white mb-4">Why Choose SwiftCourier?</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              We combine cutting-edge technology with reliable logistics to deliver an exceptional shipping experience.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="p-8 rounded-2xl bg-slate-800/50 border border-white/10 hover:border-amber-500/30 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center mb-5 group-hover:bg-amber-500/25 transition-colors duration-200">
                  <f.icon size={22} className="text-amber-400" />
                </div>
                <h3 className="font-heading text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-slate-400 text-lg">Three simple steps to ship your package</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up for free and access your personal courier dashboard.' },
              { step: '02', title: 'Book a Pickup', desc: 'Fill in sender, receiver, and package details to create a booking.' },
              { step: '03', title: 'Track & Receive', desc: 'Get a tracking number and monitor your shipment in real time.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="relative text-center p-8 rounded-2xl bg-slate-900 border border-white/10"
              >
                <span className="font-heading text-6xl font-bold text-amber-500/20 block mb-4">{item.step}</span>
                <h3 className="font-heading text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl font-bold text-white mb-4">What Our Customers Say</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah M.', role: 'Small Business Owner', text: 'SwiftCourier has transformed how I ship products to my customers. The tracking is incredibly accurate.' },
              { name: 'James K.', role: 'E-commerce Seller', text: 'Reliable, fast, and the dashboard makes managing multiple shipments a breeze. Highly recommended!' },
              { name: 'Priya L.', role: 'Freelance Designer', text: 'I send design samples regularly and SwiftCourier handles fragile items with exceptional care.' },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="p-8 rounded-2xl bg-slate-800/50 border border-white/10 hover:border-amber-500/20 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-slate-500 text-xs">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
          >
            <div className="p-12 rounded-3xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20">
              <Package size={48} className="text-amber-400 mx-auto mb-6" />
              <h2 className="font-heading text-4xl font-bold text-white mb-4">Ready to Ship?</h2>
              <p className="text-slate-400 text-lg mb-8">
                Join thousands of customers who trust SwiftCourier for their shipping needs.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-amber-500 text-slate-900 font-semibold text-base hover:bg-amber-400 hover:scale-105 transition-all duration-200"
              >
                Start Shipping Today
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;