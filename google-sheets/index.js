import 'dotenv/config';
import { GoogleAuth } from 'google-auth-library';
import { sheets } from '@googleapis/sheets';
import path from 'path';
import fs from 'fs';

let sheetsClient = null;
export const SPREAD_SHEET_ID = process.env.SPREAD_SHEET_ID;

async function init() {
  generateCredentialsFile();

  const auth = new GoogleAuth({
    keyFile: path.join(path.resolve(), 'google-sheets', 'credentials.json'),
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive',
    ],
  });
  const authClient = await auth.getClient();

  sheetsClient = sheets({ version: 'v4', auth: authClient, });

  console.log('Sheets API initialized!');
}

function generateCredentialsFile() {
  const credentialsBase64 = process.env.CREDENTIALS;
  const credentialsJson = Buffer.from(credentialsBase64, 'base64').toString('utf-8');

  fs.writeFileSync(path.join(path.resolve(), 'google-sheets', 'credentials.json'), credentialsJson, { flag: 'w' });
}

export async function sheetsAPI() {
  if (!sheetsClient) {
    await init();
  }

  return sheetsClient
}