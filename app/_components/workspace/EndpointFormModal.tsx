// components/workspace/EndpointFormModal.tsx
import React, { useState } from "react";
import {
  X,
  Plus,
  ChevronDown,
  Globe,
  Settings,
  AlertCircle,
  AlertTriangle, // Add this import
} from "lucide-react";
import { toast } from "sonner";
import { useCreateEndpoint } from "@/hooks/useEndpoints";
import CustomSelect from "../UI/CustomSelect";

interface EndpointFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  workspaceId: string;
  maxEndpoints: number;
  currentEndpoints: number;
}

const HTTP_METHOD_OPTIONS = [
  { value: "GET", label: "GET" },
  { value: "POST", label: "POST" },
  { value: "PUT", label: "PUT" },
  { value: "DELETE", label: "DELETE" },
  { value: "HEAD", label: "HEAD" },
  { value: "OPTIONS", label: "OPTIONS" },
  { value: "PATCH", label: "PATCH" },
];

const STATUS_CODE_OPTIONS = [
  { value: 200, label: "200 - OK" },
  { value: 201, label: "201 - Created" },
  { value: 204, label: "204 - No Content" },
  { value: 301, label: "301 - Moved Permanently" },
  { value: 302, label: "302 - Found" },
  { value: 400, label: "400 - Bad Request" },
  { value: 401, label: "401 - Unauthorized" },
  { value: 403, label: "403 - Forbidden" },
  { value: 404, label: "404 - Not Found" },
  { value: 405, label: "405 - Method Not Allowed" },
  { value: 409, label: "409 - Conflict" },
  { value: 422, label: "422 - Unprocessable Entity" },
  { value: 429, label: "429 - Too Many Requests" },
  { value: 500, label: "500 - Internal Server Error" },
  { value: 502, label: "502 - Bad Gateway" },
  { value: 503, label: "503 - Service Unavailable" },
  { value: 504, label: "504 - Gateway Timeout" },
];

const EndpointFormModal: React.FC<EndpointFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  workspaceId,
  maxEndpoints,
  currentEndpoints,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    method: "GET",
    headers: {} as Record<string, string>,
    body: "",
    expected_status: 200,
    frequency_minutes: 5,
    timeout_seconds: 30,
    is_active: true,
  });

  const [headerInput, setHeaderInput] = useState({ key: "", value: "" });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const createEndpoint = useCreateEndpoint(workspaceId);

  // NEW: Check if URL is localhost
  const isLocalhostUrl = (url: string): boolean => {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();
    return (
      lowerUrl.includes("localhost") ||
      lowerUrl.includes("127.0.0.1") ||
      lowerUrl.includes("0.0.0.0") ||
      lowerUrl.match(/https?:\/\/192\.168\./)
    );
  };

  // NEW: Get environment-aware warning message
  const getLocalhostWarning = () => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    // const isDevelopment = false;

    if (isDevelopment) {
      return {
        title: "Localhost URL Warning",
        message:
          "This localhost URL only exists on your local machine. The monitoring system won't be able to reach it and all checks will fail. This warning is only shown in development mode.",
        severity: "warning",
      } as const;
    } else {
      return {
        title: "Invalid Monitoring Target",
        message:
          "Localhost URLs cannot be monitored by this system. The monitoring server cannot access URLs that only exist on your local machine. Please use a publicly accessible URL instead.",
        severity: "error",
      } as const;
    }
  };

  // Form validation helper
  const isFormValid = () => {
    const nameValid = formData.name.trim().length > 0;
    const urlValid =
      formData.url.trim().length > 0 && formData.url.match(/^https?:\/\//);
    const frequencyValid =
      formData.frequency_minutes >= 5 && formData.frequency_minutes <= 60;
    const timeoutValid =
      formData.timeout_seconds >= 5 && formData.timeout_seconds <= 120;
    const notAtLimit = currentEndpoints < maxEndpoints;

    return (
      nameValid && urlValid && frequencyValid && timeoutValid && notAtLimit
    );
  };

  // Frequency validation message helper
  const getFrequencyValidationMessage = () => {
    if (formData.frequency_minutes === 0) {
      return "Frequency is required";
    }
    if (formData.frequency_minutes < 5) {
      return "Minimum frequency is 5 minutes";
    }
    if (formData.frequency_minutes > 60) {
      return "Maximum frequency is 60 minutes";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Endpoint name is required");
      return;
    }

    if (!formData.url.trim()) {
      toast.error("URL is required");
      return;
    }

    if (!formData.url.match(/^https?:\/\//)) {
      toast.error("URL must start with http:// or https://");
      return;
    }

    // Add frequency validation
    if (formData.frequency_minutes < 5) {
      toast.error("Check frequency must be at least 5 minutes");
      return;
    }

    if (formData.frequency_minutes > 60) {
      toast.error("Check frequency cannot exceed 60 minutes");
      return;
    }

    if (currentEndpoints >= maxEndpoints) {
      toast.error(`Maximum ${maxEndpoints} endpoints per workspace`);
      return;
    }

    try {
      const endpointData = {
        ...formData,
        name: formData.name.trim(),
        url: formData.url.trim(),
        body: formData.body.trim() || undefined,
        headers:
          Object.keys(formData.headers).length > 0
            ? formData.headers
            : undefined,
      };

      await createEndpoint.mutateAsync(endpointData);

      toast.success("Endpoint created!", {
        description: `"${formData.name}" is now being monitored`,
        duration: 3000,
      });

      resetForm();
      onClose();
      onSuccess();
    } catch (error: any) {
      toast.error("Failed to create endpoint", {
        description: error?.message || "Unknown error",
        duration: 4000,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      url: "",
      method: "GET",
      headers: {},
      body: "",
      expected_status: 200,
      frequency_minutes: 5,
      timeout_seconds: 30,
      is_active: true,
    });
    setHeaderInput({ key: "", value: "" });
    setShowAdvanced(false);
  };

  const handleClose = () => {
    if (!createEndpoint.isPending) {
      resetForm();
      onClose();
    }
  };

  const addHeader = () => {
    if (headerInput.key && headerInput.value) {
      setFormData((prev) => ({
        ...prev,
        headers: {
          ...prev.headers,
          [headerInput.key]: headerInput.value,
        },
      }));
      setHeaderInput({ key: "", value: "" });
    }
  };

  const removeHeader = (key: string) => {
    setFormData((prev) => ({
      ...prev,
      headers: Object.fromEntries(
        Object.entries(prev.headers).filter(([k]) => k !== key)
      ),
    }));
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-500/20 text-green-400";
      case "POST":
        return "bg-blue-500/20 text-blue-400";
      case "PUT":
        return "bg-yellow-500/20 text-yellow-400";
      case "DELETE":
        return "bg-red-500/20 text-red-400";
      case "PATCH":
        return "bg-purple-500/20 text-purple-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  if (!isOpen) return null;

  // NEW: Get localhost warning info
  const showLocalhostWarning = isLocalhostUrl(formData.url);
  const localhostWarning = showLocalhostWarning ? getLocalhostWarning() : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-black border border-white/20 rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-black border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold">Add Endpoint</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={createEndpoint.isPending}
            className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Endpoint Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., API Health Check, Login Endpoint"
                maxLength={100}
                required
                disabled={createEndpoint.isPending}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-400 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                URL *
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, url: e.target.value }))
                }
                placeholder="https://example.com/api/health"
                maxLength={500}
                required
                disabled={createEndpoint.isPending}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-400 disabled:opacity-50"
              />

              {/* NEW: Localhost Warning */}
              {localhostWarning && (
                <div
                  className={`mt-3 p-3 rounded-lg border flex items-start space-x-3 ${
                    localhostWarning.severity === "error"
                      ? "bg-red-500/10 border-red-500/30 text-red-200"
                      : "bg-yellow-500/10 border-yellow-500/30 text-yellow-200"
                  }`}
                >
                  <AlertTriangle
                    className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                      localhostWarning.severity === "error"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  />
                  <div>
                    <p className="font-medium text-sm">
                      {localhostWarning.title}
                    </p>
                    <p className="text-sm mt-1 opacity-90">
                      {localhostWarning.message}
                    </p>
                    {process.env.NODE_ENV === "development" && (
                      <p className="text-xs mt-2 opacity-75">
                        💡 Try using{" "}
                        <code className="bg-white/10 px-1 rounded">ngrok</code>{" "}
                        or your actual domain for testing
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="relative">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      HTTP Method
                    </label>
                    <CustomSelect
                      value={formData.method}
                      onChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          method: value,
                        }))
                      }
                      options={HTTP_METHOD_OPTIONS}
                      disabled={createEndpoint.isPending}
                      className="w-full"
                      renderSelected={(option) => (
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(
                            option.value
                          )}`}
                        >
                          {option.label}
                        </span>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Expected Status
                </label>
                <CustomSelect
                  value={formData.expected_status}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      expected_status: value,
                    }))
                  }
                  options={STATUS_CODE_OPTIONS}
                  disabled={createEndpoint.isPending}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Advanced Settings Toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            disabled={createEndpoint.isPending}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <Settings className="w-4 h-4" />
            <span>Advanced Settings</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showAdvanced ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Advanced Settings */}
          {showAdvanced && (
            <div className="space-y-4 p-4 bg-white/5 rounded-lg border border-white/10">
              {/* Frequency & Timeout */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Check Frequency (minutes)
                  </label>
                  <input
                    type="number"
                    value={
                      formData.frequency_minutes === 0
                        ? ""
                        : formData.frequency_minutes
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        setFormData((prev) => ({
                          ...prev,
                          frequency_minutes: 0,
                        }));
                      } else {
                        const parsed = parseInt(value);
                        if (!isNaN(parsed)) {
                          setFormData((prev) => ({
                            ...prev,
                            frequency_minutes: parsed,
                          }));
                        }
                      }
                    }}
                    min={5}
                    max={60}
                    disabled={createEndpoint.isPending}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-lg focus:outline-none focus:ring-1 text-white disabled:opacity-50 ${
                      formData.frequency_minutes >= 5 &&
                      formData.frequency_minutes <= 60
                        ? "border-white/10 focus:border-blue-500 focus:ring-blue-500"
                        : "border-red-500/50 focus:border-red-500 focus:ring-red-500"
                    }`}
                  />
                  {getFrequencyValidationMessage() && (
                    <p className="mt-1 text-sm text-red-400">
                      {getFrequencyValidationMessage()}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Must be between 5-60 minutes
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Timeout (seconds)
                  </label>
                  <input
                    type="number"
                    value={
                      formData.timeout_seconds === 0
                        ? ""
                        : formData.timeout_seconds
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        setFormData((prev) => ({
                          ...prev,
                          timeout_seconds: 0,
                        }));
                      } else {
                        const parsed = parseInt(value);
                        if (!isNaN(parsed)) {
                          setFormData((prev) => ({
                            ...prev,
                            timeout_seconds: parsed,
                          }));
                        }
                      }
                    }}
                    min={5}
                    max={120}
                    disabled={createEndpoint.isPending}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-white disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Headers */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Headers (Optional)
                </label>
                <div className="space-y-2">
                  {/* Add Header Form */}
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={headerInput.key}
                      onChange={(e) =>
                        setHeaderInput((prev) => ({
                          ...prev,
                          key: e.target.value,
                        }))
                      }
                      placeholder="Header name"
                      disabled={createEndpoint.isPending}
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-400 text-sm disabled:opacity-50"
                    />
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={headerInput.value}
                        onChange={(e) =>
                          setHeaderInput((prev) => ({
                            ...prev,
                            value: e.target.value,
                          }))
                        }
                        placeholder="Header value"
                        disabled={createEndpoint.isPending}
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-400 text-sm disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={addHeader}
                        disabled={
                          createEndpoint.isPending ||
                          !headerInput.key ||
                          !headerInput.value
                        }
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Header List */}
                  {Object.entries(formData.headers).length > 0 && (
                    <div className="space-y-2">
                      {Object.entries(formData.headers).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="break-words">
                              <span className="font-medium text-white">
                                {key}:
                              </span>
                              <span className="text-gray-300 ml-2 break-all">
                                {value}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeHeader(key)}
                            disabled={createEndpoint.isPending}
                            className="p-1 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Request Body */}
              {(formData.method === "POST" ||
                formData.method === "PUT" ||
                formData.method === "PATCH") && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Request Body
                  </label>
                  <textarea
                    value={formData.body}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, body: e.target.value }))
                    }
                    placeholder="JSON, form data, or other request body..."
                    maxLength={10000}
                    rows={4}
                    disabled={createEndpoint.isPending}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-400 resize-none disabled:opacity-50 font-mono text-sm"
                  />
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <AlertCircle className="w-4 h-4" />
              <span>
                {currentEndpoints}/{maxEndpoints} endpoints used
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={createEndpoint.isPending}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createEndpoint.isPending || !isFormValid()}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createEndpoint.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Create Endpoint</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EndpointFormModal;
