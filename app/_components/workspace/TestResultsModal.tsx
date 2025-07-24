import React, { useState } from "react";
import {
  X,
  Copy,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

interface TestResult {
  success: boolean;
  status_code: number | null;
  response_time_ms: number;
  expected_status: number;
  response_headers?: Record<string, string>;
  response_body?: string;
  url: string;
  method: string;
  timestamp: number;
  timeout_seconds: number;
  error?: string;
}

interface TestResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: TestResult | null;
  endpointName?: string;
}

const TestResultsModal: React.FC<TestResultsModalProps> = ({
  isOpen,
  onClose,
  result,
  endpointName = "Endpoint",
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen || !result) return null;

  const formatTimestamp = (timestamp: number) => {
    // Handle timestamp in milliseconds (from Date.now())
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const formatResponseTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const truncateText = (text: string, maxLength = 500) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      toast.success(`${section} copied to clipboard`);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const getStatusIcon = () => {
    if (result.error) {
      return <AlertCircle className="w-6 h-6 text-red-400" />;
    }
    return result.success ? (
      <CheckCircle className="w-6 h-6 text-green-400" />
    ) : (
      <AlertCircle className="w-6 h-6 text-yellow-400" />
    );
  };

  const getStatusColor = () => {
    if (result.error) return "text-red-400";
    return result.success ? "text-green-400" : "text-yellow-400";
  };

  const getStatusText = () => {
    if (result.error) return "Error";
    if (result.success) return "Success";
    return "Status Mismatch";
  };

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "POST":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "PUT":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "DELETE":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      case "PATCH":
        return "text-purple-400 bg-purple-400/10 border-purple-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const formatHeaders = () => {
    const headers = result.response_headers || result.headers || {};
    if (!headers || Object.keys(headers).length === 0) {
      return "No headers received";
    }
    return Object.entries(headers)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
  };

  const formatFullResult = () => {
    const fullResult = {
      test_summary: {
        endpoint: endpointName,
        url: result.url,
        method: result.method,
        success: result.success,
        timestamp: formatTimestamp(result.timestamp || Date.now()),
      },
      request_sent: result.request_config || {
        url: result.url,
        method: result.method,
        headers: result.response_headers || result.headers || {},
        body: result.request_body || null,
        timeout_seconds: result.timeout_seconds || 30,
      },
      request_config: {
        expected_status: result.expected_status,
        timeout_seconds: result.timeout_seconds || 30,
      },
      response: {
        status_code: result.status_code,
        response_time_ms: result.response_time_ms,
        headers: result.response_headers || result.headers || {},
        body: result.response_body || "",
      },
      error: result.error || null,
    };
    return JSON.stringify(fullResult, null, 2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-black border border-white/20 rounded-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-black border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <h2 className="text-xl font-bold">Test Results</h2>
              <p className="text-sm text-gray-400">{endpointName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Overview */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center space-x-4">
              <div className={`text-2xl font-bold ${getStatusColor()}`}>
                {getStatusText()}
              </div>
              {result.status_code !== null && result.status_code !== 0 && (
                <div className="text-lg font-mono">{result.status_code}</div>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Response Time</div>
              <div className="text-lg font-bold text-blue-400">
                {formatResponseTime(result.response_time_ms)}
              </div>
            </div>
          </div>

          {/* Request Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-white/10 pb-2">
              Request Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Endpoint
                </label>
                <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium border ${getMethodColor(
                      result.method
                    )}`}
                  >
                    {result.method}
                  </span>
                  <span className="text-white break-all text-sm">
                    {result.url}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Expected vs Actual
                </label>
                <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
                  <span className="text-white font-mono text-sm">
                    {result.expected_status} →{" "}
                    {result.status_code === null || result.status_code === 0
                      ? "Network Error"
                      : result.status_code}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Test Time
                </label>
                <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-white text-sm">
                    {formatTimestamp(result.timestamp || Date.now())}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Timeout Config
                </label>
                <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-white text-sm">
                    {result.timeout_seconds || 30}s timeout
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actual Request Sent (NEW SECTION) */}
          {result.request_config && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b border-white/10 pb-2">
                Actual Request Sent
              </h3>

              {/* Request Headers */}
              {result.request_config.headers &&
                Object.keys(result.request_config.headers).length > 0 && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Headers Sent
                    </label>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                      <pre className="text-white text-sm whitespace-pre-wrap break-all max-h-32 overflow-y-auto">
                        {Object.entries(result.request_config.headers)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join("\n")}
                      </pre>
                    </div>
                  </div>
                )}

              {/* Request Body */}
              {result.request_config.body && (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Body Sent
                  </label>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                    <pre className="text-white text-sm whitespace-pre-wrap break-all max-h-32 overflow-y-auto">
                      {result.request_config.body}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error Details */}
          {result.error && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b border-white/10 pb-2 text-red-400">
                Error Details
              </h3>
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <pre className="text-red-300 text-sm whitespace-pre-wrap break-all">
                  {result.error}
                </pre>
              </div>
            </div>
          )}

          {/* Response Headers */}
          {(result.response_headers || result.headers) &&
            Object.keys(result.response_headers || result.headers || {})
              .length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold border-b border-white/10 pb-2">
                    Response Headers
                  </h3>
                  <button
                    onClick={() => copyToClipboard(formatHeaders(), "Headers")}
                    className="flex items-center space-x-2 px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-colors text-sm"
                  >
                    <Copy className="w-4 h-4" />
                    <span>
                      {copiedSection === "Headers" ? "Copied!" : "Copy"}
                    </span>
                  </button>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                  <pre className="text-white text-sm whitespace-pre-wrap break-all max-h-40 overflow-y-auto">
                    {formatHeaders()}
                  </pre>
                </div>
              </div>
            )}

          {/* Response Body */}
          {result.response_body && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold border-b border-white/10 pb-2">
                  Response Body
                </h3>
                <button
                  onClick={() =>
                    copyToClipboard(result.response_body || "", "Response Body")
                  }
                  className="flex items-center space-x-2 px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-colors text-sm"
                >
                  <Copy className="w-4 h-4" />
                  <span>
                    {copiedSection === "Response Body" ? "Copied!" : "Copy"}
                  </span>
                </button>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <pre className="text-white text-sm whitespace-pre-wrap break-all max-h-60 overflow-y-auto">
                  {truncateText(result.response_body)}
                </pre>
                {result.response_body.length > 500 && (
                  <p className="text-gray-400 text-xs mt-2">
                    Showing first 500 characters. Use copy button for full
                    response.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => copyToClipboard(formatFullResult(), "Full Results")}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4" />
            <span>
              {copiedSection === "Full Results"
                ? "Copied!"
                : "Copy Full Results (JSON)"}
            </span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestResultsModal;
