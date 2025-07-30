import React from 'react';
import { ArrowRight, BookOpen, CheckCircle } from 'lucide-react';

interface TrustSignal {
  text: string;
  icon?: React.ReactNode;
}

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  trustSignals?: TrustSignal[];
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

const defaultTrustSignals: TrustSignal[] = [
  { text: "Always Free", icon: <CheckCircle className="w-4 h-4 text-green-400" /> },
  { text: "No Credit Card", icon: <CheckCircle className="w-4 h-4 text-green-400" /> },
  { text: "Open Source", icon: <CheckCircle className="w-4 h-4 text-green-400" /> }
];

const CTASection: React.FC<CTASectionProps> = ({ 
  title = "Ready to Keep Your Projects Alive?",
  subtitle = "Start monitoring your side projects and get notified when something goes wrong",
  primaryButtonText = "Get Started Free",
  secondaryButtonText = "Check Out the Blog",
  trustSignals = defaultTrustSignals,
  onPrimaryClick,
  onSecondaryClick
}) => {
  return (
    <div className="relative z-10 px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          {title}
        </h2>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          {subtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button 
            onClick={onPrimaryClick}
            className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all flex items-center space-x-2 text-lg font-medium cursor-pointer"
          >
            <span>{primaryButtonText}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={onSecondaryClick}
            className="px-8 py-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-all flex items-center space-x-2 text-lg font-medium cursor-pointer"
          >
            <BookOpen className="w-5 h-5" />
            <span>{secondaryButtonText}</span>
          </button>
        </div>
        
        {trustSignals.length > 0 && (
          <div className="flex items-center justify-center space-x-8 mt-12 text-sm text-gray-400">
            {trustSignals.map((signal, index) => (
              <div key={index} className="flex items-center space-x-2">
                {signal.icon}
                <span>{signal.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CTASection;