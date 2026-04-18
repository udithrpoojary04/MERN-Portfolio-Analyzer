import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Code, GitBranch, Briefcase } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl"
      >
        <div className="inline-block p-1 rounded-full bg-gradient-to-r from-primary-500 to-accent-purple mb-6 animate-pulse">
          <div className="px-4 py-1 bg-white dark:bg-dark-900 rounded-full text-sm font-semibold flex items-center space-x-2">
            <Sparkles size={16} className="text-accent-purple" />
            <span>AI-Powered Portfolio Analysis</span>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
          Elevate your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">Tech Career&nbsp;</span> with AI
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          Upload your resume, connect your GitHub, and link your portfolio. Our advanced AI will analyze your profile and give you actionable insights to land your dream job.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link to="/register" className="btn-primary px-8 py-4 text-lg w-full sm:w-auto">
            Get Started For Free
          </Link>
          <a href="#features" className="btn-secondary px-8 py-4 text-lg w-full sm:w-auto">
            Learn More
          </a>
        </div>
      </motion.div>

      <div id="features" className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        <FeatureCard 
          icon={<Code size={32} className="text-primary-500" />}
          title="Code Quality Score"
          description="We evaluate your open source contributions and project complexity."
        />
        <FeatureCard 
          icon={<GitBranch size={32} className="text-accent-purple" />}
          title="Project Impact"
          description="Assess the real-world impact and structural integrity of your repos."
        />
        <FeatureCard 
          icon={<Briefcase size={32} className="text-accent-green" />}
          title="Job Readiness"
          description="Get a tailored roadmap to move from beginner to ready-to-hire status."
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -5, scale: 1.02 }}
    className="glass-panel p-8 flex flex-col items-center text-center transition-all duration-300 hover:shadow-glow-primary"
  >
    <div className="p-4 rounded-2xl bg-gray-100 dark:bg-dark-800 mb-6 drop-shadow-md">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400">{description}</p>
  </motion.div>
);

export default LandingPage;
