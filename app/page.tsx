"use client"
import React from 'react';
import { motion } from 'motion/react';

// Layout Components
import Navbar from './_components/layout/Navbar';
import Footer from './_components/layout/Footer';
import AnimatedBackground from './_components/layout/AnimatedBackground';

// Section Components
import HeroSection from './_components/sections/HeroSection';
import StatsSection from './_components/sections/StatsSection';
import FeaturesSection from './_components/sections/FeaturesSection';
import DashboardPreview from './_components/sections/DashboardPreview';
import CTASection from './_components/sections/CTASection';

const HomePage: React.FC = () => {
  // Navigation handlers
  const handleLoginClick = () => {
    window.location.href = '/login';
  };

  const handleGetStartedClick = () => {
    window.location.href = '/register';
  };

  const handleStartMonitoringClick = () => {
    // TODO: Navigate to register/dashboard
    console.log('Navigate to start monitoring');
  };

  const handleViewSourceClick = () => {
    // TODO: Open GitHub repository
    window.open('https://github.com/akm-xdd/lookout-client', '_blank');
  };

  return (
    <motion.div  
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.8, ease: "easeInOut" }}
      className="min-h-screen bg-black text-white overflow-hidden"
    >
      {/* Animated Background */}
      <AnimatedBackground particleCount={50} />

      {/* Navigation */}
      <Navbar 
        onLoginClick={handleLoginClick}
        onGetStartedClick={handleGetStartedClick}
      />

      {/* Hero Section */}
      <HeroSection 
        onStartMonitoringClick={handleStartMonitoringClick}
        onViewSourceClick={handleViewSourceClick}
      />

      {/* Stats Section */}
      <StatsSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Dashboard Preview */}
      <DashboardPreview />

      {/* Final CTA */}
      <CTASection 
        onPrimaryClick={handleGetStartedClick}
        onSecondaryClick={handleViewSourceClick}
        
      />

      {/* Footer */}
      <Footer />
    </motion.div>
  );
};

export default HomePage;