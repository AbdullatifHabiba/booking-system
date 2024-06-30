// app/api/zoom/callback/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import { saveTokens } from '@/app/utils/tokenStore';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const userId = searchParams.get('state');

  if (!code) {
    return NextResponse.json({ message: 'Authorization code is missing' }, { status: 400 });
  }

  const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID!;
  const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET!;
  const ZOOM_REDIRECT_URI = process.env.ZOOM_REDIRECT_URI!;

  const tokenUrl = 'https://zoom.us/oauth/token';
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: ZOOM_REDIRECT_URI,
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

    // Replace `1` with the actual userId you want to associate with the tokens
    // get userId from the jwt token
    //

    await saveTokens(Number(userId), { accessToken: access_token, refreshToken: refresh_token });

    return NextResponse.json({ accessToken: access_token }, { status: 200 });
  } catch (error) {
    console.error('Error fetching access token:', error);
    return NextResponse.json({ message: 'Failed to fetch access token' }, { status: 500 });
  }
}
