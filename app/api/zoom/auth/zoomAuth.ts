// app/utils/zoomAuth.ts
import axios from 'axios';
import { saveTokens, getStoredRefreshToken } from '@/app/utils/tokenStore';

async function refreshAccessToken(userId: number) {
  const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID!;
  const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET!;
  const refreshToken = await getStoredRefreshToken(userId);

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const tokenUrl = 'https://zoom.us/oauth/token';
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  const auth = Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64');

  try {
    const response = await axios.post(tokenUrl, null, {
      params: params,
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const { access_token, refresh_token } = response.data;

    // Update tokens in secure storage
    await saveTokens(userId, { accessToken: access_token, refreshToken: refresh_token });

    return access_token;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw new Error('Failed to refresh access token');
  }
}

export { refreshAccessToken };
