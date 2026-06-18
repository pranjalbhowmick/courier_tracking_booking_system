import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAppStore } from '../store/appStore';

const schema = z.object({
  senderName: z.string().min(2, 'Sender name is required'),
  senderPhone: z.string().min(7, 'Valid phone number required'),
  receiverName: z.string().min(2, 'Receiver name is required'),
  receiverPhone: z.string().min(7, 'Valid phone number required'),
  packageType: z.enum(['Document', 'Parcel', 'Fragile', 'Electronics']),
  packageWeight: z.coerce.number().min(0.1, 'Weight must be at least 0.1 kg').max(100, 'Max 100 kg'),
});

type FormData = z.infer<typeof schema>;

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
}

const inputClass = 'w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200 text-sm';
const labelClass = 'block text-sm font-medium text-slate-300 mb-1.5';
const errorClass = 'text-red-400 text-xs mt-1';

const BookingModal: React.FC<BookingModalProps> = ({ open, onClose }) => {
  const { createBooking, user } = useAppStore();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { senderName: user?.name ?? '', packageType: 'Document' },
  });

  const onSubmit = (data: FormData) => {
    createBooking(data);
    toast.success('Booking created successfully!');
    reset({ senderName: user?.name ?? '', packageType: 'Document' });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg bg-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <Package size={18} className="text-amber-400" />
                </div>
                <h2 id="booking-modal-title" className="font-heading text-lg font-bold text-white">New Booking</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div>
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3">Sender Information</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="senderName" className={labelClass}>Sender Name</label>
                    <input id="senderName" {...register('senderName')} className={inputClass} placeholder="Full name" />
                    {errors.senderName && <p className={errorClass}>{errors.senderName.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="senderPhone" className={labelClass}>Sender Phone</label>
                    <input id="senderPhone" {...register('senderPhone')} className={inputClass} placeholder="+1-555-0000" />
                    {errors.senderPhone && <p className={errorClass}>{errors.senderPhone.message}</p>}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3">Receiver Information</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="receiverName" className={labelClass}>Receiver Name</label>
                    <input id="receiverName" {...register('receiverName')} className={inputClass} placeholder="Full name" />
                    {errors.receiverName && <p className={errorClass}>{errors.receiverName.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="receiverPhone" className={labelClass}>Receiver Phone</label>
                    <input id="receiverPhone" {...register('receiverPhone')} className={inputClass} placeholder="+1-555-0000" />
                    {errors.receiverPhone && <p className={errorClass}>{errors.receiverPhone.message}</p>}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3">Package Information</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="packageType" className={labelClass}>Package Type</label>
                    <select id="packageType" {...register('packageType')} className={inputClass}>
                      <option value="Document">Document</option>
                      <option value="Parcel">Parcel</option>
                      <option value="Fragile">Fragile</option>
                      <option value="Electronics">Electronics</option>
                    </select>
                    {errors.packageType && <p className={errorClass}>{errors.packageType.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="packageWeight" className={labelClass}>Weight (kg)</label>
                    <input id="packageWeight" type="number" step="0.1" {...register('packageWeight')} className={inputClass} placeholder="0.0" />
                    {errors.packageWeight && <p className={errorClass}>{errors.packageWeight.message}</p>}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-lg text-sm font-medium text-slate-300 border border-slate-700 hover:bg-white/5 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 rounded-lg text-sm font-semibold bg-amber-500 text-slate-900 hover:bg-amber-400 hover:scale-105 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Create Booking
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;