// app/_components/settings/IntegrationsSettings.tsx
import React from "react";
import { Webhook, Slack, MessageSquare, Shield } from "lucide-react";

const IntegrationsSettings: React.FC = () => {
  const comingSoonIntegrations = [
    {
      name: "Webhooks",
      icon: <Webhook className="w-6 h-6" />,
      description: "Send HTTP requests to your endpoints when incidents occur",
      features: ["Custom payloads", "Retry logic", "Authentication headers"]
    },
    {
      name: "Slack",
      icon: <Slack className="w-6 h-6" />,
      description: "Get instant notifications in your Slack channels",
      features: ["Channel routing", "Custom messages", "Thread updates"]
    },
    {
      name: "Discord",
      icon: <MessageSquare className="w-6 h-6" />,
      description: "Send alerts to Discord servers and channels",
      features: ["Server integration", "Rich embeds", "Role mentions"]
    },
    {
      name: "PagerDuty",
      icon: <Shield className="w-6 h-6" />,
      description: "Trigger incidents and escalate critical alerts",
      features: ["Incident management", "Escalation policies", "On-call routing"]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Webhook className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-bold">Integrations</h2>
        <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
          Coming Soon
        </span>
      </div>

      <p className="text-gray-400">
        Connect LookOut with your favorite tools and services to streamline your incident response workflow.
      </p>

      {/* Coming Soon Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {comingSoonIntegrations.map((integration, index) => (
          <div
            key={integration.name}
            className="bg-white/5 border border-white/10 rounded-lg p-6 opacity-75"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-gray-400">
                {integration.icon}
              </div>
              <h3 className="text-lg font-semibold">{integration.name}</h3>
            </div>
            
            <p className="text-gray-400 text-sm mb-4">
              {integration.description}
            </p>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-300">Features:</h4>
              <ul className="space-y-1">
                {integration.features.map((feature, idx) => (
                  <li key={idx} className="text-sm text-gray-400 flex items-center space-x-2">
                    <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-2">
          Want early access?
        </h3>
        <p className="text-blue-300 text-sm mb-4">
          These integrations are currently in development. Join our waitlist to be notified when they become available.
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
          Join Waitlist
        </button>
      </div>
    </div>
  );
};

export default IntegrationsSettings;