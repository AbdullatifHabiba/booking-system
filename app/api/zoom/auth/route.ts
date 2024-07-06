// This file is responsible for handling the Zoom SOS flow and storing the tokens in the database.
import { authenticate } from '@/app/utils/auth';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import qs from 'querystring';

// create zoom access token
export async function GET(req:NextRequest) {
    // authenticate the user
    const token = req.headers.get('Authorization')?.split(' ')[1];

    const user = authenticate(token);
  
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID_S, ZOOM_CLIENT_SECRET_S } = process.env;
    const request = await axios.post(
        'https://zoom.us/oauth/token',
        qs.stringify({ grant_type: 'account_credentials', account_id: ZOOM_ACCOUNT_ID }),
        {
            headers: {
                Authorization: `Basic ${Buffer.from(`${ZOOM_CLIENT_ID_S}:${ZOOM_CLIENT_SECRET_S}`).toString('base64')}`,
            },
        },
    );
   const { access_token, expires_in } = await request.data;


    return NextResponse.json({ access_token, expires_in }, { status: 200 });
  
}
