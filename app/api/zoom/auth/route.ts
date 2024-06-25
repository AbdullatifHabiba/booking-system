// app/api/zoom/auth/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID!;
  const ZOOM_REDIRECT_URI = process.env.ZOOM_REDIRECT_URI!;
  const authUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${ZOOM_CLIENT_ID}&redirect_uri=${ZOOM_REDIRECT_URI}`;

  return NextResponse.redirect(authUrl);
}
