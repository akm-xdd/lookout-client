// app/_components/layout/Navbar.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  onLoginClick?: () => void;
  onGetStartedClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick, onGetStartedClick }) => {
  const { session, user, signOut, loading, initialized } = useAuth();
  const router = useRouter();

  const handleGetStartedClick = () => {
    if (onGetStartedClick) {
      onGetStartedClick();
    } else {
      router.push('/register');
    }
  };

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      router.push('/login');
    }
  };

  const handleDashboardClick = () => {
    router.push('/dashboard');
  };

  const handleSignOut = async () => {
    await signOut();
    // AuthContext will handle the redirect
  };

  // Show loading state during initialization
  const isLoading = !initialized || loading;

  return (
    <nav className="relative z-10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <Image src="/icon.png" alt="LookOut" className="w-8 h-8" width={32} height={32} />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            LookOut
          </span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {isLoading ? (
            // Show loading state
            <div className="w-8 h-8 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
          ) : session ? (
            // Show authenticated state
            <>
              <span className="text-gray-300 text-sm hidden sm:block">
                {user?.email}
              </span>
              <button 
                onClick={handleDashboardClick}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Dashboard
              </button>
              <button 
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-all"
              >
                Sign Out
              </button>
            </>
          ) : (
            // Show unauthenticated state
            <>
              <button 
                onClick={handleLoginClick}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Login
              </button>
              <button 
                onClick={handleGetStartedClick}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;