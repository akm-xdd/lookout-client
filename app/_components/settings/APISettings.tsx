// app/_components/settings/APISettings.tsx
import React from "react";
import { Key, Shield, Code } from "lucide-react";

const APISettings: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Key className="w-6 h-6 text-yellow-400" />
        <h2 className="text-2xl font-bold">API & Security</h2>
        <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">
          Coming Soon
        </span>
      </div>

      <p className="text-gray-400">
        Manage API keys, authentication tokens, and security settings for programmatic access.
      </p>

      {/* Coming Soon Sections */}
      <div className="space-y-6">
        {/* API Keys Section */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 opacity-75">
          <div className="flex items-center space-x-3 mb-4">
            <Key className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold">API Keys</h3>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Generate and manage API keys for accessing LookOut programmatically.
          </p>
          <div className="space-y-2 text-sm text-gray-400">
            <div>• Create scoped API keys</div>
            <div>• Set expiration dates</div>
            <div>• Monitor usage statistics</div>
            <div>• Revoke access instantly</div>
          </div>
        </div>

        {/* Webhook Security */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 opacity-75">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold">Webhook Security</h3>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Configure authentication and security for incoming webhooks.
          </p>
          <div className="space-y-2 text-sm text-gray-400">
            <div>• Signature verification</div>
            <div>• IP allowlisting</div>
            <div>• Custom headers</div>
            <div>• Rate limiting</div>
          </div>
        </div>

        {/* Developer Tools */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 opacity-75">
          <div className="flex items-center space-x-3 mb-4">
            <Code className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold">Developer Tools</h3>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Tools and resources for developers integrating with LookOut.
          </p>
          <div className="space-y-2 text-sm text-gray-400">
            <div>• API documentation</div>
            <div>• Code examples</div>
            <div>• SDK downloads</div>
            <div>• Testing playground</div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-purple-400 mb-2">
          API Documentation
        </h3>
        <p className="text-purple-300 text-sm mb-4">
          While the UI is in development, you can already access our API endpoints programmatically.
        </p>
        <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
          View API Docs
        </button>
      </div>
    </div>
  );
};

export default APISettings;