import { useState, useEffect } from 'react';
import { checkUserOnlineStatus } from '../services/onlineStatusService';

/**
 * Hook to track a single user's online status
 * @param {number} userId - User ID to track
 * @param {number} refreshInterval - Refresh interval in ms (default: 30000)
 * @returns {Object} { status, loading, error, refetch }
 */
const useUserOnlineStatus = (userId, refreshInterval = 30000) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatus = async () => {
    if (!userId) {
      console.log('⚠️ useUserOnlineStatus: No userId provided, skipping fetch');
      return;
    }

    console.log('🔄 Fetching online status for user:', userId);
    try {
      const result = await checkUserOnlineStatus(userId);
      console.log('✅ Online status result:', result);
      
      if (result.success) {
        setStatus(result.data);
        setError(null);
      } else {
        console.error('❌ Failed to get online status:', result.error);
        setError(result.error);
      }
    } catch (err) {
      console.error('❌ Error fetching online status:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchStatus(); // Initial fetch

    // Set up polling
    const interval = setInterval(fetchStatus, refreshInterval);

    return () => clearInterval(interval);
  }, [userId, refreshInterval]);

  return {
    status,
    loading,
    error,
    refetch: fetchStatus,
  };
};

export default useUserOnlineStatus;

