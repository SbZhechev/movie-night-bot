import 'dotenv/config';
import { GoogleAuth } from 'google-auth-library';
import { sheets } from '@googleapis/sheets';

let sheetsClient = null;
export const SPREAD_SHEET_ID = process.env.SPREAD_SHEET_ID;

async function init() {
  const credentialsBase64 = process.env.CREDENTIALS;
  const credentialsJson = JSON.parse(Buffer.from(credentialsBase64, 'base64').toString('utf-8'));

  const auth = new GoogleAuth({
    credentials: credentialsJson,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive',
    ],
  });
  const authClient = await auth.getClient();

  sheetsClient = sheets({ version: 'v4', auth: authClient, });

  console.log('Sheets API initialized!');
}

export async function sheetsAPI() {
  if (!sheetsClient) {
    await init();
  }

  return sheetsClient
}