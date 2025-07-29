// app/_components/settings/SettingsHeader.tsx
import React from "react";
import { motion } from "motion/react";
import { ArrowLeft, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const SettingsHeader: React.FC = () => {
  const router = useRouter();

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <header className="relative z-10 px-6 py-6 border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <motion.div
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/icon.png"
                  alt="LookOut Logo"
                  className="w-8 h-8"
                  width={32}
                  height={32}
                />
                <span>LookOut</span>
              </Link>
            </motion.div>

            {/* Back to Dashboard */}
            <motion.button
              onClick={handleBackToDashboard}
              className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </motion.button>
          </div>

          {/* Right side - Settings Title */}
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-gray-400" />
            <motion.h1
              className="text-2xl font-bold"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Settings
            </motion.h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SettingsHeader;