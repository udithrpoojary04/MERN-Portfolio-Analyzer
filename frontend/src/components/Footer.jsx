import { BrainCircuit } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-dark-900/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 text-primary-500 mb-4 md:mb-0">
          <BrainCircuit size={24} className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          <span className="text-lg font-bold tracking-wider text-gray-900 dark:text-gray-100">
            Dev<span className="text-primary-500">Sight</span>
          </span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} AI Portfolio Analyzer. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
