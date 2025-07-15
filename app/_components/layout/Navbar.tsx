import React from 'react';
import Image from 'next/image';

interface NavbarProps {
  onLoginClick?: () => void;
  onGetStartedClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick, onGetStartedClick }) => {
  return (
    <nav className="relative z-10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Image src="/icon.png" alt="LookOut" className="w-8 h-8"  width={32} height={32} />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            LookOut
          </span>
        </div>
        <div className="flex items-center space-x-4">
            <button 
            onClick={onLoginClick}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
            
            >
            Login
            </button>
          <button 
            onClick={onGetStartedClick}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;