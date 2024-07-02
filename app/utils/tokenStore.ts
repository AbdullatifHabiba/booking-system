import axios from 'axios';
import qs from 'querystring';
export  async function  getAccessToken(){

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
   const { access_token } = await request.data;
   return access_token;

}