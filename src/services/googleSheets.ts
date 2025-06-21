import knexLib, { Knex } from "knex";
import knexConfig from "../config/knex/knexfile.js";
import { google } from "googleapis";
import { Tariff } from "../interfaces/tariff.interface.js";
import { 
  CREDENTIALS_PATH, 
  SCOPES, 
  DEFAULT_SHEET_RANGE 
} from "../config/constants.js";

function authorize() {
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: SCOPES,
  });
  return auth;
}

const appendToGoogleSheets = async (sheetId: string, range: string, values: (string | number)[][]) => {
  const auth = await authorize();
  const sheets = google.sheets({ version: 'v4', auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  });

  const existingValues = response.data.values || [];
  let requestBody = { values: values.slice(1) };

  if (existingValues.length === 0 || existingValues[0].length === 0) {
    requestBody = { values: [values[0]] };
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: values.slice(1) },
  });

  console.log('Данные записаны в Google Sheets');
}

export const syncGoogleSheets = async (): Promise<void> => {
  const knex: Knex = knexLib(knexConfig.development);
  try {
    const sheetIds = (process.env.SHEETS_ID || "").split(",").filter(Boolean);
    const range = process.env.SHEET_RANGE || DEFAULT_SHEET_RANGE;

    const tariffs: Tariff[] = await knex("tariffs").orderBy("kgvpMarketplace", "asc");

    if (tariffs.length === 0) {
      console.log("В базе нет данных");
      return;
    }

    const headers = Object.keys(tariffs[0]);
    const rows = tariffs.map(obj => Object.values(obj));
    const values = [headers, ...rows];

    for (const sheetId of sheetIds) {
      await appendToGoogleSheets(sheetId, range, values);
    }

  } catch (error) {
    console.error("Ошибка при записи в Google Sheets:", error);
  } finally {
    await knex.destroy();
  }
}
