import { getCookie } from './storageManager'

/**
 * Parses the user ID (sub) from a JWT access token or from a cookie.
 * @param access_token Optional access token string.
 * @returns The user ID (sub) as a string or { sub: null } if parsing fails.
 */
export const parseUserIdFromToken = (access_token: string | null = null): string | { sub: null } => {
  try {
    const token = access_token ?? getCookie('cmp.rfc7519') ?? null;

    if (!token) {
      return { sub: null };
    }

    const base64Payload = token.split('.')[1];
    const decodedPayload = atob(base64Payload);
    const parsedPayload = JSON.parse(decodedPayload);

    return parsedPayload.sub || { sub: null };
  } catch (error) {
    console.error('Failed to parse JWT token:', error);
    return { sub: null };
  }
};

/**
 * Gets the number of days until the refresh token expires.
 * @param refresh_token The JWT refresh token string.
 * @returns Number of days until expiration (as a string with 2 decimal places), or 0 if expired/invalid.
 */
export const getRefreshTokenExpiration = (refresh_token: string | null): string | number => {
  if (!refresh_token) return 0;

  try {
    const payload = JSON.parse(atob(refresh_token.split('.')[1]));
    const now = Math.ceil(Date.now() / 1000);

    if (payload.exp > now) {
      const secondsUntilExpiration = payload.exp - now;
      const days = secondsUntilExpiration / (60 * 60 * 24);
      return days.toFixed(2); // e.g. "2.34"
    }

    return 0;
  } catch (error) {
    console.error('Failed to decode refresh token:', error);
    return 0;
  }
};
