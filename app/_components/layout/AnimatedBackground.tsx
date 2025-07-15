import React, { useState, useEffect } from 'react';

interface AnimatedBackgroundProps {
  particleCount?: number;
}

interface Particle {
  left: number;
  top: number;
  animationDelay: number;
  animationDuration: number;
  size: number;
  opacity: number;
  color: string;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  particleCount = 30 
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  // Generate proper particles that are actually visible
  useEffect(() => {
    const colors = [
      'bg-blue-400/40',
      'bg-purple-400/40', 
      'bg-pink-400/30',
      'bg-cyan-400/30',
      'bg-indigo-400/40'
    ];

    const newParticles = [...Array(particleCount)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: Math.random() * 4,
      animationDuration: 3 + Math.random() * 4,
      size: 2 + Math.random() * 4, // 2-6px instead of 1px
      opacity: 0.3 + Math.random() * 0.4, // 0.3-0.7 instead of 0.2
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setParticles(newParticles);
  }, [particleCount]);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Enhanced Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-pink-900/25"></div>
      
      {/* Floating Orbs - Much More Visible */}
      <div className="absolute inset-0">
        {particles.map((particle, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${particle.color} animate-pulse blur-[0.5px]`}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.animationDelay}s`,
              animationDuration: `${particle.animationDuration}s`,
              opacity: particle.opacity,
              animation: `float ${particle.animationDuration}s ${particle.animationDelay}s infinite ease-in-out alternate, pulse 2s infinite`
            }}
          />
        ))}
      </div>

      {/* Floating animation keyframes */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;