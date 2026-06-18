import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Twitter, Linkedin, Github, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center">
                <Package size={20} className="text-slate-900" />
              </div>
              <span className="font-heading text-xl font-bold text-white">
                Swift<span className="text-amber-400">Courier</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Fast, reliable courier services for businesses and individuals worldwide.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: Twitter, label: 'Twitter' },
                { icon: Linkedin, label: 'LinkedIn' },
                { icon: Github, label: 'GitHub' },
                { icon: Mail, label: 'Email' },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-amber-500/20 transition-all duration-200"
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Product</h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', to: '/' },
                { label: 'Track Shipment', to: '/track' },
                { label: 'Book Courier', to: '/dashboard' },
              ].map(item => (
                <li key={item.to}>
                  <Link to={item.to} className="text-slate-400 text-sm hover:text-amber-400 transition-colors duration-200">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              {['About Us', 'Careers', 'Blog', 'Press'].map(item => (
                <li key={item}>
                  <span className="text-slate-400 text-sm cursor-default">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
                <li key={item}>
                  <span className="text-slate-400 text-sm cursor-default">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">© 2026 SwiftCourier. All rights reserved.</p>
          <p className="text-slate-500 text-sm">Built for speed. Delivered with care.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;