// hooks/useNotificationSettings.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Types remain the same...
interface NotificationSettings {
  id: string;
  user_id: string;
  email_notifications_enabled: boolean;
  notification_email: string;
  failure_threshold: number;
  email_address_changed: boolean;
  created_at: string;
  updated_at: string;
}

interface NotificationSettingsUpdate {
  email_notifications_enabled?: boolean;
  notification_email?: string;
  failure_threshold?: number;
}


// const API_BASE_URL = process.env.NODE_ENV === 'production' 
//   ? 'https://api.lookoutapi.xyz' 
//   : 'http://localhost:8000';

const API_BASE_URL = 'http://localhost:8000'; 

// Hook
export const useNotificationSettings = () => {
  const { session } = useAuth(); // Use your existing auth context
  const queryClient = useQueryClient();

  // API Functions that use the session from context
  const fetchNotificationSettings = async (): Promise<NotificationSettings> => {



    if (!session?.access_token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/user/notification-settings/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.detail || 
        `Failed to fetch notification settings: ${response.status}`
      );
    }

    return response.json();
  };

  const updateNotificationSettings = async (
    updates: NotificationSettingsUpdate
  ): Promise<NotificationSettings> => {
    if (!session?.access_token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/user/notification-settings/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.detail || 
        `Failed to update notification settings: ${response.status}`
      );
    }

    return response.json();
  };

  // Rest of the hook remains the same...
  const {
    data,
    isLoading,
    error,
    isError,
    refetch
  } = useQuery({
    queryKey: ['notification-settings'],
    queryFn: fetchNotificationSettings,
    enabled: !!session?.access_token, // Only run if we have a token
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('authentication')) {
        return false;
      }
      return failureCount < 3;
    }
  });

  const updateSettings = useMutation({
    mutationFn: updateNotificationSettings,
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(['notification-settings'], updatedSettings);
      queryClient.invalidateQueries({ queryKey: ['dashboard-data'] });
    },
    onError: (error: Error) => {
      console.error('Update notification settings error:', error);
      
      if (error.message.includes('email_address_changed')) {
        toast.error('Email already changed', {
          description: 'You can only change your notification email once. Contact support for assistance.',
          duration: 5000
        });
      } else if (error.message.includes('authentication')) {
        toast.error('Authentication error', {
          description: 'Please sign in again to update your settings.',
          duration: 4000
        });
      } else {
        toast.error('Update failed', {
          description: error.message || 'Failed to update notification settings',
          duration: 4000
        });
      }
    }
  });

  return {
    data,
    isLoading,
    error,
    isError,
    refetch,
    updateSettings,
    isUpdating: updateSettings.isPending
  };
};