import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 px-6 py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <img src="/icon.png" alt="LookOut" className="w-8 h-8" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              LookOut
            </span>
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <span>© {currentYear} LookOut</span>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;