// app/api/zoom/callback/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ message: 'Authorization code is missing' }, { status: 400 });
  }

  const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID!;
  const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET!;
  const ZOOM_REDIRECT_URI = process.env.ZOOM_REDIRECT_URI!;
console.log(ZOOM_CLIENT_ID,ZOOM_CLIENT_SECRET,ZOOM_REDIRECT_URI);
  const tokenUrl = 'https://zoom.us/oauth/token';
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
     code: code,
    redirect_uri: ZOOM_REDIRECT_URI,
  });
  console.log('params', params.toString());

  const auth = Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64');
  console.log('auth', auth);

  try {
    const response = await axios.post(tokenUrl, null, {
      params: params,  
      headers: {
        Authorization: `Basic ${auth}`
      },
    });

    const accessToken = response.data.access_token;

    // set as environment variable
    process.env.ZOOM_ACCESS_TOKEN = accessToken;

    return NextResponse.json({ accessToken }, { status: 200 });
  } catch (error) {
    console.error('Error fetching access token:', (error as any).response ? (error as any).response.data : (error as any).message);
    return NextResponse.json({ message: 'Failed to fetch access token' }, { status: 500 });
  }
}
