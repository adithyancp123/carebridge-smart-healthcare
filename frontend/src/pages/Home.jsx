import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, HeartPulse, Users, ShieldCheck, Mail, HeartHandshake, AlertTriangle, Activity, CheckCircle, Shield } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import api from '../api';

const Counter = ({ end, duration = 2 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const endValue = parseInt(end, 10);
    if (start === endValue) return;

    let totalMilSecDur = parseInt(duration);
    let incrementTime = (totalMilSecDur / endValue) * 1000;
    if (incrementTime < 10) incrementTime = 10; 

    const step = Math.max(Math.ceil(endValue / (totalMilSecDur * 1000 / incrementTime)), 1);

    const timer = setInterval(() => {
      start += step;
      if (start > endValue) {
        setCount(endValue);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{count}</span>;
};

const Home = () => {
  const [stats, setStats] = useState({ requests: 0, volunteers: 0, emergencies: 0 });
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard');
        const emergencies = data.requests.filter(r => r.urgency === 'High').length;
        setStats({ requests: data.requests.length, volunteers: data.volunteers.length, emergencies });
        setShowBanner(emergencies > 0);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] overflow-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-[#0B1220] dark:via-[#111827] dark:to-[#0B1220] transition-colors duration-300">
      
      {showBanner && (
        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} className="bg-red-600 dark:bg-[#450a0a] dark:border-b dark:border-[#7f1d1d] text-white dark:text-[#fca5a5] px-4 py-3 text-center shadow-lg relative z-50 flex items-center justify-center gap-2 transition-colors">
          <AlertTriangle className="w-5 h-5 animate-pulse" />
          <span className="font-bold">Active Emergencies:</span> There are <Counter end={stats.emergencies} duration={1} /> high-priority patient requests needing immediate attention. 
          <Link to="/volunteer" className="underline font-bold ml-2 hover:text-red-200 dark:hover:text-white">Help Now</Link>
        </motion.div>
      )}

      {/* Premium Hero Section */}
      <section className="relative flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-blue-500/10 blur-3xl mix-blend-multiply" />
          <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-3xl mix-blend-multiply" />
        </div>

        <motion.div className="max-w-5xl mx-auto text-center relative z-10" variants={containerVariants} initial="hidden" animate="visible">
          
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-blue-800 font-bold text-sm mb-8 shadow-md border border-blue-100">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping absolute ml-1"></span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 ml-1"></span>
            <span className="ml-2">Live Matching AI Engine Active</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6 leading-tight">
            Bridging the gap to <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 drop-shadow-sm">
              life-saving healthcare
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="mt-4 text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
            CareBridge connects critical patients with verified medical volunteers instantly using our predictive geo-routing AI. No one faces a crisis alone.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/request-help" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto group flex items-center justify-center gap-2 bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-blue-700/20 hover:bg-blue-800 hover:shadow-blue-700/40 hover:-translate-y-1 transition-all duration-300">
                Request Support Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/volunteer" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-gray-800 border-2 border-gray-200 px-8 py-4 rounded-xl font-bold text-lg shadow-sm hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-300">
                Become a Volunteer
                <Users className="w-5 h-5" />
              </button>
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-6 mb-12 text-sm font-semibold text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2 bg-white dark:bg-[#1F2937] px-4 py-2 rounded-full border border-gray-200 dark:border-[#374151] shadow-sm"><Shield className="w-4 h-4 text-emerald-500" /> End-to-End Encrypted</div>
            <div className="flex items-center gap-2 bg-white dark:bg-[#1F2937] px-4 py-2 rounded-full border border-gray-200 dark:border-[#374151] shadow-sm"><CheckCircle className="w-4 h-4 text-blue-500" /> Verified Volunteers Only</div>
            <div className="flex items-center gap-2 bg-white dark:bg-[#1F2937] px-4 py-2 rounded-full border border-gray-200 dark:border-[#374151] shadow-sm"><HeartPulse className="w-4 h-4 text-rose-500" /> Emergency Priority Routing</div>
          </motion.div>

          {/* Animated Stats Counters */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <StatCard icon={<Activity className="w-5 h-5 text-blue-600" />} title="Patients Routed" value={stats.requests} />
            <StatCard icon={<Users className="w-5 h-5 text-emerald-600" />} title="Verified Responders" value={stats.volunteers} />
            <StatCard icon={<HeartPulse className="w-5 h-5 text-rose-600" />} title="AI Success Rate" value={100} suffix="%" className="col-span-2 md:col-span-1" />
          </motion.div>
        </motion.div>
      </section>

      {/* Testimonials / Impact */}
      <section className="bg-white dark:bg-[#0B1220] py-20 border-t border-gray-100 dark:border-[#374151] relative overflow-hidden transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Real World Impact</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Our automated triage engine has facilitated thousands of successful medical interventions across the region.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <ImpactCard 
              quote="The AI system flagged my father's cardiac distress as a high-priority emergency. Within 12 minutes, a verified nurse from our exact neighborhood was at our door."
              author="Sarah Jenkins"
              role="Patient Family Member"
              location="New York, NY"
            />
            <ImpactCard 
              quote="As a volunteer paramedic, CareBridge's geo-routing gives me exactly what I need. It sends me direct coordinates for critical cases near my route home."
              author="David Miller"
              role="Verified Paramedic"
              location="Boston, MA"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 dark:bg-[#111827]/50 py-20 border-t border-gray-200 dark:border-[#374151] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">How CareBridge Works</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Seamless execution from request to medical intervention.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-blue-200 via-emerald-200 to-blue-200 -z-10 transform -translate-y-1/2"></div>
            <FeatureCard icon={<HeartPulse className="w-8 h-8 text-rose-600" />} title="1. Instant Intake" desc="Intelligent forms process critical patient requirements instantly." delay={0.1} />
            <FeatureCard icon={<ShieldCheck className="w-8 h-8 text-blue-600" />} title="2. NLP Triage" desc="Backend NLP parses keywords to auto-escalate priority metrics." delay={0.2} />
            <FeatureCard icon={<HeartHandshake className="w-8 h-8 text-emerald-600" />} title="3. Geo-Matching" desc="Algorithms route the closest verified volunteer to the patient." delay={0.3} />
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 dark:bg-[#080d17] text-gray-400 py-10 text-center border-t border-gray-800 dark:border-[#374151]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center gap-2 mb-4 text-blue-400">
            <HeartPulse className="w-6 h-6" /><span className="text-xl font-bold text-white">CareBridge</span>
          </div>
          <p>&copy; {new Date().getFullYear()} CareBridge Systems. Engineered for impact.</p>
        </div>
      </footer>
    </div>
  );
};

const StatCard = ({ icon, title, value, suffix = "", className = "" }) => (
  <div className={`bg-white/90 dark:bg-[#1F2937]/90 backdrop-blur-md border border-gray-200 dark:border-[#374151] p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg transition-all ${className}`}>
    <div className="flex items-center justify-center gap-2 mb-3">{icon}<span className="font-semibold text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">{title}</span></div>
    <div className="text-5xl font-extrabold text-gray-900 dark:text-white flex justify-center items-baseline">
      <Counter end={value} duration={1.5} />{suffix}
    </div>
  </div>
);

const ImpactCard = ({ quote, author, role, location }) => (
  <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-[#1F2937] p-8 rounded-3xl shadow-md border border-gray-100 dark:border-[#374151] flex flex-col justify-between">
    <div className="text-blue-600 dark:text-blue-400 opacity-20 mb-4"><svg className="w-12 h-12" fill="currentColor" viewBox="0 0 32 32"><path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-2.2 1.8-4 4-4V8zm16 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-2.2 1.8-4 4-4V8z"></path></svg></div>
    <p className="text-xl text-gray-700 dark:text-gray-300 italic leading-relaxed mb-8">"{quote}"</p>
    <div className="flex items-center gap-4 border-t border-gray-100 dark:border-[#374151] pt-4">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-blue-900/50 dark:to-emerald-900/50 rounded-full flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-lg">{author.charAt(0)}</div>
      <div>
        <div className="font-bold text-gray-900 dark:text-white">{author}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{role} • {location}</div>
      </div>
    </div>
  </motion.div>
);

const FeatureCard = ({ icon, title, desc, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay }} whileHover={{ y: -5 }} className="bg-white/80 dark:bg-[#1F2937]/80 backdrop-blur-xl border border-gray-200 dark:border-[#374151] p-8 rounded-3xl hover:shadow-xl transition-all duration-300">
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#111827] dark:to-[#1F2937] flex items-center justify-center mb-6 shadow-inner border border-gray-200 dark:border-[#374151]">{icon}</div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
  </motion.div>
);

export default Home;
