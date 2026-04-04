import 'dotenv/config';
import { sheetsAPI, SPREAD_SHEET_ID } from "./index.js";

const MOVIES_LIST_SHEET = process.env.SPREAD_SHEET_NAME;

export const getList = async () => {
  const sheetsClient = await sheetsAPI();

  const response = await sheetsClient.spreadsheets.values.get({
    spreadsheetId: SPREAD_SHEET_ID,
    range: MOVIES_LIST_SHEET
  });

  return response.data.values;
}

export const appendToList = async (movie) => {
  const sheetsClient = await sheetsAPI();

  await sheetsClient.spreadsheets.values.append({
    spreadsheetId: SPREAD_SHEET_ID,
    range: MOVIES_LIST_SHEET,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [movie],
    }
  });
}

export const updateList = async (movies) => {
  const sheetsClient = await sheetsAPI();

  await sheetsClient.spreadsheets.values.update({
    spreadsheetId: SPREAD_SHEET_ID,
    range: MOVIES_LIST_SHEET,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      majorDimension: 'ROWS',
      values: movies,
    }
  });
}