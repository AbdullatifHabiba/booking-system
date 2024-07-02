// This file is responsible for handling the Zoom SOS flow and storing the tokens in the database.
import axios from 'axios';
import { NextResponse } from 'next/server';
import qs from 'querystring';

// create zoom access token
export async function GET() {
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
    const data = await request.data;
    return NextResponse.json({ data }, { status: 200 });
}
