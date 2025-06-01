// src/hooks/useAutoRefreshToken.js
import { useEffect } from 'react';
import { APPURL } from "../constants/appUrl"
import api from '../constants/api';

const useAutoRefreshToken = (intervalMs = 4 * 60 * 1000) => {
  useEffect(() => {
    const refreshToken = async () => {
      try {
        await api.post(`${APPURL}auth/refresh`, {}, { withCredentials: true });
        console.log('[✓] Access token refreshed');
      } catch (err) {
        console.error('[!] Failed to refresh token', err);
      }
    };

    const interval = setInterval(refreshToken, intervalMs);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [intervalMs]);
};

export default useAutoRefreshToken;
