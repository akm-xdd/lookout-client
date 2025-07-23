import React from 'react';
import { Shield, Zap, BarChart3, Bell } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeaturesSectionProps {
  features?: Feature[];
  title?: string;
  subtitle?: string;
}

const defaultFeatures: Feature[] = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Keep Apps Awake",
    description: "Prevent free-tier hosting platforms from putting your side projects to sleep"
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Uptime Monitoring",
    description: "Track availability and response times with detailed analytics"
  },
  {
    icon: <Bell className="w-6 h-6" />,
    title: "Smart Alerts",
    description: "Get notified via email, Slack or custom webhooks"
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Developer-First",
    description: "Built by a solo dev, for solo devs. Full control over configuration"
  }
];

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ 
  features = defaultFeatures,
  title = "Everything You Need",
  subtitle = "Simple, powerful monitoring tools designed specifically for indie developers"
}) => {
  return (
    <div className="relative z-10 px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="group p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <div className="text-blue-400">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;