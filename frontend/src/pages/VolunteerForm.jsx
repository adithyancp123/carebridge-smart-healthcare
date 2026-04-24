import React, { useState } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { Users, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const VolunteerForm = () => {
  const initialState = { name: '', phone: '', email: '', skill: 'Doctor', availability: '', city: '', message: '' };
  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.city || !formData.availability) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    setIsSubmitting(true);
    const loadingToast = toast.loading('Registering...');
    
    try {
      const response = await api.post('/volunteers', formData);
      const ticketId = response.data.volunteer?.ticketId || 'CB-UNKNOWN';
      const emailSent = response.data.emailSent;
      
      if (emailSent) {
        toast.success(`Registration Confirmed. Confirmation email sent. (Ticket: ${ticketId})`, { id: loadingToast, duration: 5000 });
      } else {
        toast.success(`Registration saved successfully. Email notification unavailable. (Ticket: ${ticketId})`, { id: loadingToast, duration: 5000, icon: '⚠️' });
      }
      setTimeout(() => toast.success('NGO verification team notified'), 500);
      setFormData(initialState);
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || 'Backend offline or unreachable.';
      toast.error(`Failed to submit registration. ${errMsg}`, { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-[#0B1220] transition-colors duration-300 relative overflow-hidden flex items-center">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto w-full relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4 shadow-inner border border-emerald-200 dark:border-emerald-800">
            <Users className="w-8 h-8 text-emerald-700 dark:text-emerald-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Volunteer Registration</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Join our mission to provide immediate healthcare support to those in need.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/80 dark:bg-[#1F2937]/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-gray-100 dark:border-[#374151] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-blue-400"></div>
          
          <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="form-label text-gray-800 dark:text-gray-200 font-semibold">Full Name *</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="form-input focus:ring-emerald-600 bg-gray-50/50 dark:bg-[#111827]/50 dark:text-white dark:border-[#374151]" placeholder="Jane Smith" />
            </div>

            <div>
              <label className="form-label text-gray-800 dark:text-gray-200 font-semibold">Phone Number *</label>
              <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-input focus:ring-emerald-600 bg-gray-50/50 dark:bg-[#111827]/50 dark:text-white dark:border-[#374151]" placeholder="+1 234 567 8900" />
            </div>

            <div>
              <label className="form-label text-gray-800 dark:text-gray-200 font-semibold">Email Address *</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} className="form-input focus:ring-emerald-600 bg-gray-50/50 dark:bg-[#111827]/50 dark:text-white dark:border-[#374151]" placeholder="jane@example.com" />
            </div>

            <div>
              <label className="form-label text-gray-800 dark:text-gray-200 font-semibold">Your Skill / Role *</label>
              <div className="relative">
                <select name="skill" value={formData.skill} onChange={handleChange} className="form-input focus:ring-emerald-600 bg-gray-50/50 dark:bg-[#111827]/50 dark:text-white dark:border-[#374151] appearance-none cursor-pointer">
                  <option value="Doctor" className="dark:bg-[#1F2937]">🩺 Doctor</option>
                  <option value="Nurse" className="dark:bg-[#1F2937]">⚕️ Nurse / Paramedic</option>
                  <option value="Driver" className="dark:bg-[#1F2937]">🚑 Driver / Transport</option>
                  <option value="Caretaker" className="dark:bg-[#1F2937]">🤝 Caretaker</option>
                  <option value="Other" className="dark:bg-[#1F2937]">➕ Other</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700 dark:text-gray-300">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="form-label text-gray-800 dark:text-gray-200 font-semibold">City / Location *</label>
              <input required type="text" name="city" value={formData.city} onChange={handleChange} className="form-input focus:ring-emerald-600 bg-gray-50/50 dark:bg-[#111827]/50 dark:text-white dark:border-[#374151]" placeholder="New York" />
            </div>

            <div className="sm:col-span-2">
              <label className="form-label text-gray-800 dark:text-gray-200 font-semibold">Availability *</label>
              <input required type="text" name="availability" value={formData.availability} onChange={handleChange} className="form-input focus:ring-emerald-600 bg-gray-50/50 dark:bg-[#111827]/50 dark:text-white dark:border-[#374151]" placeholder="E.g., Weekends, Evenings, 24/7" />
            </div>

            <div className="sm:col-span-2">
              <label className="form-label text-gray-800 dark:text-gray-200 font-semibold">Message (Optional)</label>
              <textarea rows="4" name="message" value={formData.message} onChange={handleChange} className="form-input focus:ring-emerald-600 bg-gray-50/50 dark:bg-[#111827]/50 dark:text-white dark:border-[#374151] resize-none" placeholder="Any additional information..."></textarea>
            </div>
          </div>

          <div className="mt-8 pt-4">
            <button type="submit" disabled={isSubmitting} className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed">
              {isSubmitting ? 'Registering...' : (
                <>
                  Register as Volunteer <Send className="w-5 h-5" />
                </>
              )}
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">Thank you for pledging your time to help others.</p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default VolunteerForm;
