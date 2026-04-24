import React, { useEffect, useState } from 'react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartPulse, Users, AlertTriangle, Clock, Search, MapPin, CheckCircle, Download, Activity, FileText, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Dashboard = () => {
  const [data, setData] = useState({ requests: [], volunteers: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('patients'); // 'patients' | 'volunteers' | 'analytics'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterUrgency, setFilterUrgency] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSkill, setFilterSkill] = useState('');
  const [activities, setActivities] = useState([]);

  const fetchData = async () => {
    try {
      const response = await api.get('/dashboard');
      const actResponse = await api.get('/activities').catch(() => ({ data: [] }));
      if (response.data && Array.isArray(response.data.requests)) {
        setData(response.data);
        setActivities(actResponse.data || []);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Cannot connect to backend. Backend may be offline.');
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = (type) => {
    const list = type === 'patients' ? filteredRequests : filteredVolunteers;
    if (!list.length) return toast.error(`No ${type} to export`);
    
    const headers = Object.keys(list[0]).filter(k => k !== 'summary' && k !== 'matchSuggestion');
    const csvContent = [
      headers.join(','),
      ...list.map(item => headers.map(header => `"${(item[header] || '').toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `carebridge_${type}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${type} successfully`);
  };

  const downloadReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('CareBridge Analytics Report', 14, 22);
    
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    doc.setFontSize(12);
    doc.text(`Total Requests: ${safeRequests.length}`, 14, 40);
    doc.text(`Total Volunteers: ${safeVolunteers.length}`, 14, 48);
    doc.text(`Critical Cases: ${safeRequests.filter(r => r.urgency === 'High').length}`, 14, 56);

    autoTable(doc, {
      startY: 65,
      head: [['Patient Requests', 'City', 'Need', 'Urgency', 'Status']],
      body: safeRequests.map(r => [r.name, r.city, r.medicalNeed, r.urgency, r.status || 'Pending']),
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] }
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      head: [['Verified Volunteers', 'City', 'Skill', 'Availability']],
      body: safeVolunteers.map(v => [v.name, v.city, v.skill, v.availability]),
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] }
    });

    doc.save('CareBridge_Report.pdf');
    toast.success('Report downloaded successfully');
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const loadingId = toast.loading('Updating status...');
      await api.put(`/requests/${id}/status`, { status: newStatus });
      fetchData(); // Refresh data
      toast.success('Status updated', { id: loadingId });
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-[#0B1220] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
          <div className="flex justify-between items-center">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
            <div className="flex gap-4">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-28 bg-white dark:bg-[#1F2937] rounded-2xl shadow-sm border border-gray-100 dark:border-[#374151]"></div>
            ))}
          </div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-full mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 bg-white dark:bg-[#1F2937] rounded-xl shadow-sm border border-gray-100 dark:border-[#374151]"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const safeRequests = Array.isArray(data?.requests) ? data.requests : [];
  const safeVolunteers = Array.isArray(data?.volunteers) ? data.volunteers : [];

  const filteredRequests = [...safeRequests]
    .filter(req => (req.city || '').toLowerCase().includes(searchTerm.toLowerCase()) || (req.name || '').toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(req => filterCity ? (req.city || '').toLowerCase() === filterCity.toLowerCase() : true)
    .filter(req => filterUrgency ? req.urgency === filterUrgency : true)
    .filter(req => filterStatus ? (req.status || 'Pending') === filterStatus : true)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
  const filteredVolunteers = [...safeVolunteers]
    .filter(vol => (vol.city || '').toLowerCase().includes(searchTerm.toLowerCase()) || (vol.name || '').toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(vol => filterCity ? (vol.city || '').toLowerCase() === filterCity.toLowerCase() : true)
    .filter(vol => filterSkill ? vol.skill === filterSkill : true)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const allCities = Array.from(new Set([...safeRequests.map(r=>r.city), ...safeVolunteers.map(v=>v.city)])).filter(Boolean);

  const cityData = Object.entries(safeRequests.reduce((acc, r) => { acc[r.city] = (acc[r.city] || 0) + 1; return acc; }, {})).map(([name, value]) => ({ name, value }));
  const urgencyData = Object.entries(safeRequests.reduce((acc, r) => { acc[r.urgency] = (acc[r.urgency] || 0) + 1; return acc; }, {})).map(([name, value]) => ({ name, value }));
  const skillData = Object.entries(safeVolunteers.reduce((acc, v) => { acc[v.skill] = (acc[v.skill] || 0) + 1; return acc; }, {})).map(([name, value]) => ({ name, value }));
  const statusData = Object.entries(safeRequests.reduce((acc, r) => { const st = r.status || 'Pending'; acc[st] = (acc[st] || 0) + 1; return acc; }, {})).map(([name, value]) => ({ name, value }));
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const handleCardClick = (type) => {
    if (type === 'patients') {
      setActiveTab('patients');
    } else if (type === 'volunteers') {
      setActiveTab('volunteers');
    } else if (type === 'critical') {
      setActiveTab('patients');
      setFilterUrgency('High');
      setTimeout(() => document.getElementById('tabs-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else if (type === 'cities') {
      setActiveTab('analytics');
      setTimeout(() => document.getElementById('tabs-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-[#0B1220] py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search by name or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full form-input bg-white dark:bg-[#1F2937] dark:text-white dark:border-[#374151] shadow-sm focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button onClick={() => exportCSV('patients')} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-[#1F2937] text-gray-700 dark:text-gray-200 text-sm font-medium border border-gray-200 dark:border-[#374151] rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm whitespace-nowrap">
                <Download className="w-4 h-4 text-blue-500" /> Patients CSV
              </button>
              <button onClick={() => exportCSV('volunteers')} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-[#1F2937] text-gray-700 dark:text-gray-200 text-sm font-medium border border-gray-200 dark:border-[#374151] rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm whitespace-nowrap">
                <Download className="w-4 h-4 text-emerald-500" /> Volunteers CSV
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-white dark:bg-[#1F2937] rounded-xl border border-gray-100 dark:border-[#374151] shadow-sm transition-colors">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-medium">
            <Filter className="w-4 h-4" /> Filters:
          </div>
          <select value={filterCity} onChange={e => setFilterCity(e.target.value)} className="text-sm border border-gray-200 dark:border-[#374151] rounded-lg px-3 py-1.5 bg-gray-50 dark:bg-[#0B1220] text-gray-700 dark:text-gray-300 outline-none">
            <option value="">All Cities</option>
            {allCities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {activeTab === 'patients' && (
            <>
              <select value={filterUrgency} onChange={e => setFilterUrgency(e.target.value)} className="text-sm border border-gray-200 dark:border-[#374151] rounded-lg px-3 py-1.5 bg-gray-50 dark:bg-[#0B1220] text-gray-700 dark:text-gray-300 outline-none">
                <option value="">All Urgencies</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="text-sm border border-gray-200 dark:border-[#374151] rounded-lg px-3 py-1.5 bg-gray-50 dark:bg-[#0B1220] text-gray-700 dark:text-gray-300 outline-none">
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Assigned">Assigned</option>
                <option value="Resolved">Resolved</option>
              </select>
            </>
          )}
          {activeTab === 'volunteers' && (
            <select value={filterSkill} onChange={e => setFilterSkill(e.target.value)} className="text-sm border border-gray-200 dark:border-[#374151] rounded-lg px-3 py-1.5 bg-gray-50 dark:bg-[#0B1220] text-gray-700 dark:text-gray-300 outline-none">
              <option value="">All Skills</option>
              <option value="Doctor">Doctor</option>
              <option value="Nurse">Nurse</option>
              <option value="Driver">Driver</option>
              <option value="Caretaker">Caretaker</option>
              <option value="Other">Other</option>
            </select>
          )}
          {(filterCity || filterUrgency || filterStatus || filterSkill) && (
            <button onClick={() => { setFilterCity(''); setFilterUrgency(''); setFilterStatus(''); setFilterSkill(''); }} className="text-sm text-red-500 hover:text-red-700 font-medium">Clear</button>
          )}
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div whileHover={{ y: -5 }} onClick={() => handleCardClick('patients')} className="bg-white dark:bg-[#1F2937] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#374151] flex flex-col transition-all cursor-pointer hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800">
            <div className="text-gray-500 dark:text-gray-400 font-medium mb-1">Total Requests</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{safeRequests.length}</div>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} onClick={() => handleCardClick('volunteers')} className="bg-white dark:bg-[#1F2937] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#374151] flex flex-col transition-all cursor-pointer hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-800">
            <div className="text-gray-500 dark:text-gray-400 font-medium mb-1">Total Volunteers</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{safeVolunteers.length}</div>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} onClick={() => handleCardClick('critical')} className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl shadow-sm border border-red-100 dark:border-red-800/30 flex flex-col transition-all cursor-pointer hover:shadow-lg hover:shadow-red-500/10 hover:border-red-300 dark:hover:border-red-700">
            <div className="text-red-600 dark:text-red-400 font-medium mb-1">Critical (High Urgency)</div>
            <div className="text-3xl font-bold text-red-700 dark:text-red-300">{safeRequests.filter(r => r.urgency === 'High').length}</div>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} onClick={() => handleCardClick('cities')} className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-2xl shadow-sm border border-emerald-100 dark:border-emerald-800/30 flex flex-col transition-all cursor-pointer hover:shadow-lg hover:shadow-emerald-500/10 hover:border-emerald-300 dark:hover:border-emerald-700">
            <div className="text-emerald-600 dark:text-emerald-400 font-medium mb-1">Matched Cities</div>
            <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
              {new Set([...safeRequests.map(r => (r.city || '').toLowerCase()), ...safeVolunteers.map(v => (v.city || '').toLowerCase())]).size}
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div id="tabs-section" className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('patients')}
            className={`py-4 px-6 text-center font-medium text-sm transition-all relative ${activeTab === 'patients' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <div className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5" /> Patient Requests
            </div>
            {activeTab === 'patients' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
          </button>
          <button
            onClick={() => setActiveTab('volunteers')}
            className={`py-4 px-6 text-center font-medium text-sm transition-all relative ${activeTab === 'volunteers' ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" /> Registered Volunteers
            </div>
            {activeTab === 'volunteers' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />}
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-4 px-6 text-center font-medium text-sm transition-all relative ${activeTab === 'analytics' ? 'text-purple-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" /> Analytics
            </div>
            {activeTab === 'analytics' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />}
          </button>
        </div>

        {/* Content */}
        <div className="grid gap-6">
          <AnimatePresence mode="wait">
            {activeTab === 'patients' ? (
              <motion.div key="patients" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                {filteredRequests.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-[#1F2937] rounded-2xl border border-dashed border-gray-300 dark:border-[#374151]">
                    <p className="text-gray-500 dark:text-gray-400">No patient requests found</p>
                  </div>
                ) : (
                  filteredRequests.map((req, i) => (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} key={req.id} className={`bg-white dark:bg-[#1F2937] p-6 rounded-2xl border-l-4 shadow-sm hover:shadow-md transition-all ${req.urgency === 'High' ? 'border-l-red-500' : req.urgency === 'Medium' ? 'border-l-yellow-500' : 'border-l-blue-500'} dark:border-y-gray-700 dark:border-r-gray-700`}>
                      <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            {req.name} <span className="text-gray-500 dark:text-gray-400 text-sm font-normal">({req.age}y)</span>
                            {req.ticketId && <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded border border-gray-200 dark:border-[#374151]">{req.ticketId}</span>}
                          </h3>
                          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mt-1">
                            <MapPin className="w-4 h-4" /> {req.city}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {req.urgency === 'High' && (
                            <span className="inline-flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                              <AlertTriangle className="w-4 h-4" /> HIGH URGENCY
                            </span>
                          )}
                          <select 
                            value={req.status || 'Pending'} 
                            onChange={(e) => updateStatus(req.id, e.target.value)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-sm cursor-pointer border-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 outline-none
                              ${req.status === 'Resolved' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : req.status === 'Assigned' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'}
                            `}
                          >
                            <option value="Pending" className="bg-white dark:bg-[#1F2937] text-gray-900 dark:text-white">Pending</option>
                            <option value="Assigned" className="bg-white dark:bg-[#1F2937] text-gray-900 dark:text-white">Assigned</option>
                            <option value="Resolved" className="bg-white dark:bg-[#1F2937] text-gray-900 dark:text-white">Resolved</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-[#1F2937]/50 rounded-xl p-4 mb-4 border border-gray-100 dark:border-[#374151] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-300 dark:bg-blue-500"></div>
                        <p className="text-gray-800 dark:text-gray-200 italic font-medium leading-relaxed">"{req.summary}"</p>
                      </div>

                      {req.matchSuggestion && (
                        <div className="mb-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 text-sm text-emerald-800 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/30 flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-500 dark:text-emerald-400" />
                          <span><strong>AI Match:</strong> {req.matchSuggestion}</span>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-[#374151] pt-4">
                        <div className="flex items-center gap-1.5"><HeartPulse className="w-4 h-4 text-blue-500" /> <strong>Need:</strong> {req.medicalNeed}</div>
                        <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-400" /> {new Date(req.timestamp).toLocaleString()}</div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            ) : activeTab === 'volunteers' ? (
              <motion.div key="volunteers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                {filteredVolunteers.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-[#1F2937] rounded-2xl border border-dashed border-gray-300 dark:border-[#374151]">
                    <p className="text-gray-500 dark:text-gray-400">No volunteers found</p>
                  </div>
                ) : (
                  filteredVolunteers.map((vol, i) => (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} key={vol.id} className="bg-white dark:bg-[#1F2937] p-6 rounded-2xl border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-all dark:border-y-gray-700 dark:border-r-gray-700">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            {vol.name}
                            {vol.ticketId && <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded border border-gray-200 dark:border-[#374151]">{vol.ticketId}</span>}
                          </h3>
                          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mt-1">
                            <MapPin className="w-4 h-4" /> {vol.city}
                          </div>
                        </div>
                        <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-bold px-3 py-1.5 rounded-full shadow-sm">
                          {vol.skill}
                        </span>
                      </div>
                      
                      <div className="bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl p-4 mb-4 border border-emerald-100 dark:border-emerald-800/30 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-400"></div>
                        <p className="text-gray-800 dark:text-gray-200 italic font-medium leading-relaxed">"{vol.summary}"</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-[#374151] pt-4">
                        <div className="flex items-center gap-1.5"><strong className="text-gray-700 dark:text-gray-300">Available:</strong> {vol.availability}</div>
                        <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-400" /> {new Date(vol.timestamp).toLocaleString()}</div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            ) : (
              <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="flex justify-end">
                  <button onClick={downloadReport} className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm font-medium">
                    <FileText className="w-4 h-4" /> Download PDF Report
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Chart 1: City */}
                  <div className="bg-white dark:bg-[#1F2937] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#374151]">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Requests by City</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={cityData}>
                          <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                          <YAxis stroke="var(--text-muted)" fontSize={12} />
                          <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-main)', borderColor: 'var(--border-color)', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{ color: 'var(--text-main)' }} />
                          <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Chart 2: Urgency */}
                  <div className="bg-white dark:bg-[#1F2937] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#374151]">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Requests by Urgency</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={urgencyData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} stroke="var(--card-bg)">
                            {urgencyData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                          </Pie>
                          <RechartsTooltip contentStyle={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-main)', borderColor: 'var(--border-color)', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{ color: 'var(--text-main)' }} />
                          <Legend wrapperStyle={{ color: 'var(--text-main)' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Chart 3: Skills */}
                  <div className="bg-white dark:bg-[#1F2937] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#374151]">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Volunteer Skills</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={skillData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#10b981" stroke="var(--card-bg)">
                            {skillData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />)}
                          </Pie>
                          <RechartsTooltip contentStyle={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-main)', borderColor: 'var(--border-color)', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{ color: 'var(--text-main)' }} />
                          <Legend wrapperStyle={{ color: 'var(--text-main)' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Chart 4: Status */}
                  <div className="bg-white dark:bg-[#1F2937] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#374151]">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Request Status</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={statusData}>
                          <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                          <YAxis stroke="var(--text-muted)" fontSize={12} />
                          <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-main)', borderColor: 'var(--border-color)', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{ color: 'var(--text-main)' }} />
                          <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Activity Timeline */}
                <div className="bg-white dark:bg-[#1F2937] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#374151] mt-8">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Activity Timeline</h3>
                  <div className="space-y-6">
                    {activities.slice(0, 10).map((act, idx) => (
                      <div key={act.id} className="flex gap-4 relative">
                        {idx !== Math.min(activities.length, 10) - 1 && <div className="absolute top-8 left-4 w-0.5 h-full bg-gray-200 dark:bg-gray-700 -ml-px"></div>}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 shrink-0 ${act.type === 'alert' ? 'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400' : act.type === 'user-plus' ? 'bg-emerald-100 text-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-blue-100 text-blue-500 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                           <Activity className="w-4 h-4" />
                        </div>
                        <div className="pt-1">
                          <p className="text-gray-900 dark:text-white font-medium">{act.text}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(act.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                    {activities.length === 0 && <p className="text-gray-500 dark:text-gray-400">No recent activity.</p>}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
