import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Award, CheckCircle2, ChevronRight } from 'lucide-react';

const AnalysisDashboard = () => {
  const { user } = useContext(AuthContext);
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/analysis', config);
        if (data.length > 0) {
          setReport(data[0]); // getting the most recent one
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchAnalysis();
  }, [user]);

  if (!report) return <div className="text-center pt-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div><p className="mt-4 text-gray-500">Loading your AI Report...</p></div>;

  const radarData = [
    { subject: 'Code Quality', A: report.scores.codeQuality, fullMark: 100 },
    { subject: 'Design', A: report.scores.design, fullMark: 100 },
    { subject: 'Impact', A: report.scores.impact, fullMark: 100 },
    { subject: 'Overall', A: report.scores.overall, fullMark: 100 }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold dark:text-white">Your AI Profile Analysis</h2>
        <div className="px-4 py-2 bg-gradient-to-r from-accent-purple to-primary-500 rounded-full text-white font-bold inline-flex items-center shadow-glow-purple">
          <Award className="mr-2" size={20} />
          {report.jobReadiness}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Radar Chart */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel p-6 md:col-span-1 border-t-4 border-primary-500">
          <h3 className="text-xl font-semibold mb-6 text-center dark:text-gray-200">Skill Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#4B5563" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <Radar name="Score" dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.5} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '8px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-2 gap-4 md:col-span-2">
          {Object.entries(report.scores).map(([key, value], index) => (
            <motion.div 
              key={key} 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
              className="glass-panel p-6 flex flex-col justify-center items-center relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary-500/20 to-transparent rounded-bl-full transition-transform group-hover:scale-110"></div>
              <span className="text-gray-500 dark:text-gray-400 uppercase text-xs font-bold tracking-wider mb-2">{key.replace(/([A-Z])/g, ' $1')}</span>
              <span className="text-4xl font-extrabold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">{value}%</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel p-8 rounded-2xl border-l-4 border-accent-green">
          <h3 className="text-xl font-semibold mb-6 flex items-center dark:text-gray-200">
            <CheckCircle2 className="mr-3 text-accent-green" /> Actionable Improvements
          </h3>
          <ul className="space-y-4">
            {report.suggestionItems.map((item, idx) => (
              <li key={idx} className="flex items-start text-gray-700 dark:text-gray-300">
                <ChevronRight className="mr-2 text-primary-500 shrink-0 mt-0.5" size={18} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel p-8 rounded-2xl">
           <h3 className="text-xl font-semibold mb-6 dark:text-gray-200">Analyzed Data Points</h3>
           <div className="space-y-6">
             {Object.entries(report.metrics).map(([key, value], index) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="font-bold text-gray-900 dark:text-white">{value}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-primary-500 to-accent-purple h-2 rounded-full" style={{ width: `${Math.min((value / 1000) * 100, 100)}%` }}></div>
                  </div>
                </div>
             ))}
           </div>
        </motion.div>
      </div>

    </div>
  );
};

export default AnalysisDashboard;
