import React, { useState } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { HeartPulse, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const PatientForm = () => {
  const initialState = { name: '', age: '', phone: '', email: '', city: '', medicalNeed: '', urgency: 'Low', message: '' };
  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.city || !formData.medicalNeed) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    setIsSubmitting(true);
    const loadingToast = toast.loading('Submitting your request...');
    
    try {
      const response = await api.post('/requests', formData);
      const ticketId = response.data.request?.ticketId || 'CB-UNKNOWN';
      toast.success(`Request Confirmed! Ticket ID: ${ticketId}`, { id: loadingToast, duration: 5000 });
      setTimeout(() => toast.success(`Confirmation email sent to ${formData.email}`), 500);
      setTimeout(() => toast.success('NGO emergency team notified'), 1000);
      setFormData(initialState); // Clear form
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || 'Backend offline or unreachable.';
      toast.error(`Failed to submit request. ${errMsg}`, { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-[#0B1220] transition-colors duration-300 relative overflow-hidden flex items-center">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto w-full relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4 shadow-inner border border-blue-200 dark:border-blue-800">
            <HeartPulse className="w-8 h-8 text-blue-700 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Request Healthcare Support</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Please fill out this form so our NGO team can assist you immediately.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/80 dark:bg-[#1F2937]/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-gray-100 dark:border-[#374151] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-emerald-400"></div>
          
          <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="form-label text-gray-800 dark:text-gray-200 font-semibold">Full Name *</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="form-input focus:ring-blue-600 bg-gray-50/50 dark:bg-[#111827]/50 dark:text-white dark:border-[#374151]" placeholder="John Doe" />
            </div>
            
            <div>
              <label className="form-label text-gray-800 dark:text-gray-200 font-semibold">Age *</label>
              <input required type="number" name="age" value={formData.age} onChange={handleChange} className="form-input focus:ring-blue-600 bg-gray-50/50 dark:bg-[#111827]/50 dark:text-white dark:border-[#374151]" placeholder="45" min="1" max="120" />
            </div>

            <div>
              <label className="form-label text-gray-800 dark:text-gray-200 font-semibold">Phone Number *</label>
              <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-input focus:ring-blue-600 bg-gray-50/50 dark:bg-[#111827]/50 dark:text-white dark:border-[#374151]" placeholder="+1 234 567 8900" />
            </div>

            <div>
              <label className="form-label text-gray-800 dark:text-gray-200 font-semibold">Email Address *</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} className="form-input focus:ring-blue-600 bg-gray-50/50 dark:bg-[#111827]/50 dark:text-white dark:border-[#374151]" placeholder="john@example.com" />
            </div>

            <div>
              <label className="form-label text-gray-800 dark:text-gray-200 font-semibold">City / Location *</label>
              <input required type="text" name="city" value={formData.city} onChange={handleChange} className="form-input focus:ring-blue-600 bg-gray-50/50 dark:bg-[#111827]/50 dark:text-white dark:border-[#374151]" placeholder="New York" />
            </div>

            <div className="sm:col-span-2">
              <label className="form-label text-gray-800 dark:text-gray-200 font-semibold">Medical Need (Brief) *</label>
              <input required type="text" name="medicalNeed" value={formData.medicalNeed} onChange={handleChange} className="form-input focus:ring-blue-600 bg-gray-50/50 dark:bg-[#111827]/50 dark:text-white dark:border-[#374151]" placeholder="E.g., Oxygen cylinder, Doctor consultation, Medicines" />
            </div>

            <div className="sm:col-span-2">
              <label className="form-label text-gray-800 dark:text-gray-200 font-semibold">Urgency Level *</label>
              <div className="relative">
                <select name="urgency" value={formData.urgency} onChange={handleChange} className="form-input focus:ring-blue-600 bg-gray-50/50 dark:bg-[#111827]/50 dark:text-white dark:border-[#374151] appearance-none cursor-pointer">
                  <option value="Low" className="dark:bg-[#1F2937]">🟢 Low - Needs attention soon</option>
                  <option value="Medium" className="dark:bg-[#1F2937]">🟡 Medium - Important, needs quick action</option>
                  <option value="High" className="dark:bg-[#1F2937]">🔴 High - Emergency/Critical (Priority Queue)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700 dark:text-gray-300">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="form-label text-gray-800 dark:text-gray-200 font-semibold">Additional Message (Optional)</label>
              <textarea rows="4" name="message" value={formData.message} onChange={handleChange} className="form-input focus:ring-blue-600 bg-gray-50/50 dark:bg-[#111827]/50 dark:text-white dark:border-[#374151] resize-none" placeholder="Any other details we should know..."></textarea>
            </div>
          </div>

          <div className="mt-8 pt-4">
            <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed">
              {isSubmitting ? 'Processing Request...' : (
                <>
                  Submit Request <Send className="w-5 h-5" />
                </>
              )}
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">All information is kept strictly confidential within our NGO.</p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PatientForm;
