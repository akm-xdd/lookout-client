import React from 'react';
import { ArrowRight, Github, Code2 } from 'lucide-react';

interface HeroSectionProps {
  onStartMonitoringClick?: () => void;
  onViewSourceClick?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  onStartMonitoringClick, 
  onViewSourceClick 
}) => {
  return (
    <div className="relative z-10 px-6 py-20">
      <div className="max-w-7xl mx-auto text-center">
        
        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
          Keep Your
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Side Projects
          </span>
          <br />
          Alive
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Prevent free-tier hosting platforms from putting your apps to sleep. 
          Monitor uptime, track performance, and get instant alerts when things go wrong.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
          <button 
            onClick={onStartMonitoringClick}
            className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all flex items-center space-x-2 text-lg font-medium"
          >
            <span>Start Monitoring</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={onViewSourceClick}
            className="px-8 py-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-all flex items-center space-x-2 text-lg font-medium"
          >
            <Github className="w-5 h-5" />
            <span>View Source</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;