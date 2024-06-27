import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.EMAIL_CLIENT_ID,
  process.env.EMAIL_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: process.env.Google_Refresh_Token,
});

async function sendEmailNotification(to:any, subject:any, text:any) {
  try {
    const accessToken = (await oauth2Client.getAccessToken()).token;
          console.log("token",accessToken);
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
          type: "OAuth2",
          user: process.env.EMAIL_USER,
          accessToken: process.env.Google_Access_Token,
          clientId: process.env.EMAIL_CLIENT_ID,
          clientSecret: process.env.EMAIL_CLIENT_SECRET,
          refreshToken: process.env.Google_Refresh_Token,
        },
      });
          console.log("transporter",transporter);

      

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export { sendEmailNotification };
