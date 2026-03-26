import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal, Link as LinkIcon, FileText, Upload } from 'lucide-react';
import axios from 'axios';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [github, setGithub] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('githubUsername', github);
    formData.append('portfolioUrl', portfolio);
    if (resume) formData.append('resume', resume);

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('http://localhost:5000/api/analysis', formData, config);
      navigate('/analysis');
    } catch (err) {
      alert('Analysis failed.');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8"
      >
        <h2 className="text-3xl font-bold mb-2 dark:text-white">Welcome, {user?.name}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Submit your details below to get an AI-powered analysis of your portfolio.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GitHub Username</label>
            <div className="relative">
              <Terminal className="absolute left-3 top-3 text-gray-400" size={20} />
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-dark-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-gray-900 dark:text-white"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="e.g. johndoe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Portfolio URL</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-3 text-gray-400" size={20} />
              <input 
                type="url" 
                className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-dark-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-purple transition-all text-gray-900 dark:text-white"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                placeholder="https://johndoe.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Resume (PDF)</label>
            <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer bg-white/30 dark:bg-dark-900/30">
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => setResume(e.target.files[0])}
                accept=".pdf"
              />
              <div className="flex flex-col items-center pointer-events-none">
                <FileText className="text-gray-400 mb-2" size={32} />
                <span className="text-gray-600 dark:text-gray-400">
                  {resume ? resume.name : 'Drag & drop or click to upload'}
                </span>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg mt-8 flex justify-center items-center">
            {loading ? <Upload className="animate-bounce mr-2" /> : <Upload className="mr-2" />}
            {loading ? 'Analyzing Profile...' : 'Generate AI Report'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default UserDashboard;
