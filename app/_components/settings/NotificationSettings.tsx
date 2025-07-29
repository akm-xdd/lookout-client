// app/_components/settings/NotificationSettings.tsx
import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Bell, 
  Mail, 
  AlertTriangle, 
  Save,
  Info,
  X,
  Webhook
} from "lucide-react";
import { toast } from "sonner";
import { useNotificationSettings } from "@/hooks/useNotificationSettings";

const NotificationSettings: React.FC = () => {
  const {
    data: settings,
    isLoading,
    error,
    updateSettings,
    isUpdating
  } = useNotificationSettings();

  const [formData, setFormData] = useState({
    email_notifications_enabled: settings?.email_notifications_enabled ?? false,
    notification_email: settings?.notification_email ?? '',
    failure_threshold: settings?.failure_threshold ?? 5
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Email validation helper
  const isValidEmail = (email: string): boolean => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Check if form is valid for saving
  const isFormValid = (): boolean => {
    if (!formData.email_notifications_enabled) return true;
    
    // If email address has been changed before, we don't validate the email field
    if (settings?.email_address_changed) return true;
    
    return isValidEmail(formData.notification_email);
  };

  // Update form when settings are loaded
  React.useEffect(() => {
    if (settings) {
      const newFormData = {
        email_notifications_enabled: settings.email_notifications_enabled,
        notification_email: settings.notification_email,
        failure_threshold: settings.failure_threshold
      };
      setFormData(newFormData);
      setHasChanges(false);
    }
  }, [settings]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Check if there are changes compared to original settings
      if (settings) {
        const hasChanges = 
          updated.email_notifications_enabled !== settings.email_notifications_enabled ||
          (updated.notification_email !== settings.notification_email && !settings.email_address_changed) ||
          updated.failure_threshold !== settings.failure_threshold;
        setHasChanges(hasChanges);
      }
      
      return updated;
    });
  };

  const handleSave = async () => {
    if (!hasChanges) {
      toast.info('No changes to save');
      return;
    }

    if (!isFormValid()) {
      toast.error('Please fix validation errors before saving');
      return;
    }

    try {
      // Only send changed fields
      const updates: any = {};
      
      if (settings) {
        if (formData.email_notifications_enabled !== settings.email_notifications_enabled) {
          updates.email_notifications_enabled = formData.email_notifications_enabled;
        }
        
        // Only include email change if it's allowed (not already changed)
        if (!settings.email_address_changed && formData.notification_email !== settings.notification_email) {
          updates.notification_email = formData.notification_email;
        }
        
        if (formData.failure_threshold !== settings.failure_threshold) {
          updates.failure_threshold = formData.failure_threshold;
        }
      }

      await updateSettings.mutateAsync(updates);
      
      toast.success('Notification settings updated!', {
        description: 'Your preferences have been saved',
        duration: 3000
      });
      
      setHasChanges(false);
      
    } catch (error: any) {
      toast.error('Failed to update settings', {
        description: error?.message || 'Please try again',
        duration: 4000
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Bell className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold">Notification Settings</h2>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Bell className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold">Notification Settings</h2>
        </div>
        
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Failed to load settings</span>
          </div>
          <p className="text-red-300 mt-1 text-sm">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bell className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold">Notification Settings</h2>
        </div>
        
        {hasChanges && isFormValid() && (
          <motion.button
            onClick={handleSave}
            disabled={isUpdating}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-lg transition-colors"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isUpdating ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </motion.button>
        )}
      </div>

      <p className="text-gray-400">
        Configure how you want to be notified when your endpoints experience issues.
      </p>

      {/* Email Notifications Section */}
      <div className="space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Mail className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold">Email Notifications</h3>
          </div>

          <div className="space-y-6">
            {/* Enable/Disable Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Enable Email Notifications</h4>
                <p className="text-sm text-gray-400">
                  Receive email alerts when endpoints fail repeatedly
                </p>
              </div>
              
              <button
                onClick={() => handleInputChange('email_notifications_enabled', !formData.email_notifications_enabled)}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${formData.email_notifications_enabled ? 'bg-blue-500' : 'bg-gray-600'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${formData.email_notifications_enabled ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label htmlFor="notification-email" className="block font-medium">
                Notification Email Address
              </label>
              <div className="relative">
                <input
                  id="notification-email"
                  type="email"
                  value={formData.notification_email}
                  onChange={(e) => handleInputChange('notification_email', e.target.value)}
                  disabled={!formData.email_notifications_enabled || settings?.email_address_changed}
                  className={`
                    w-full px-4 py-3 bg-black/50 border rounded-lg text-white placeholder-gray-400 transition-all
                    ${formData.email_notifications_enabled && !settings?.email_address_changed
                      ? 'border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                      : 'border-white/10 text-gray-500 cursor-not-allowed'
                    }
                    ${!isValidEmail(formData.notification_email) && formData.notification_email && formData.email_notifications_enabled && !settings?.email_address_changed
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                      : ''
                    }
                  `}
                  placeholder="your.email@example.com"
                />
                {settings?.email_address_changed && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="flex items-center space-x-1 text-orange-400">
                      <Info className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Email Validation Error */}
              {!isValidEmail(formData.notification_email) && formData.notification_email && formData.email_notifications_enabled && !settings?.email_address_changed && (
                <div className="text-red-400 text-sm flex items-center space-x-1">
                  <X className="w-4 h-4" />
                  <span>Please enter a valid email address</span>
                </div>
              )}
              
              {settings?.email_address_changed && (
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-orange-400">
                    <Info className="w-4 h-4" />
                    <span className="text-sm font-medium">Email Change Used</span>
                  </div>
                  <p className="text-orange-300 text-sm mt-1">
                    You have already used your one-time email change. The email address field is now locked. Contact support if you need to change it again.
                  </p>
                </div>
              )}
            </div>

            {/* Failure Threshold */}
            <div className="space-y-4">
              <label htmlFor="failure-threshold" className="block font-medium">
                Failure Threshold
              </label>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    id="failure-threshold"
                    type="range"
                    min="5"
                    max="20"
                    step="1"
                    value={formData.failure_threshold}
                    onChange={(e) => handleInputChange('failure_threshold', parseInt(e.target.value))}
                    disabled={!formData.email_notifications_enabled}
                    className={`
                      w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider
                      ${!formData.email_notifications_enabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    style={{
                      background: formData.email_notifications_enabled 
                        ? `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((formData.failure_threshold - 5) / 15) * 100}%, #374151 ${((formData.failure_threshold - 5) / 15) * 100}%, #374151 100%)`
                        : '#374151'
                    }}
                  />
                  {/* Threshold Markers */}
                  <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
                    <span className={formData.failure_threshold === 5 ? 'text-blue-400 font-medium' : ''}>5</span>
                    <span className={formData.failure_threshold === 10 ? 'text-blue-400 font-medium' : ''}>10</span>
                    <span className={formData.failure_threshold === 15 ? 'text-blue-400 font-medium' : ''}>15</span>
                    <span className={formData.failure_threshold === 20 ? 'text-blue-400 font-medium' : ''}>20</span>
                  </div>
                  {/* Labels */}
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Conservative</span>
                    <span>Balanced</span>
                    <span>Patient</span>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-lg font-medium text-white bg-blue-500/20 px-4 py-2 rounded-lg border border-blue-500/30">
                    Current: <span className="text-blue-400">{formData.failure_threshold}</span> consecutive failures
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                You'll receive an email after this many consecutive failures occur.
              </p>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        {formData.email_notifications_enabled && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4"
          >
            <div className="flex items-center space-x-2 text-blue-400 mb-2">
              <Info className="w-5 h-5" />
              <span className="font-medium">Notification Preview</span>
            </div>
            <p className="text-blue-300 text-sm">
              When an endpoint fails {formData.failure_threshold} times in a row, we'll send an email to{' '}
              <span className="font-medium">{formData.notification_email || 'your notification email'}</span> with the outage details.
            </p>
          </motion.div>
        )}

        {/* Coming Soon Section */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 opacity-60">
          <div className="flex items-center space-x-3 mb-4">
            <Webhook className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold">Webhook Notifications</h3>
            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
              Coming Soon
            </span>
          </div>
          <p className="text-gray-400 text-sm">
            Send real-time webhook notifications to your applications when endpoints go down.
            Perfect for custom integrations and automated incident response.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;