import cron from 'node-cron';
import { fetchTariffs } from './fetchTariffs.js';
import { saveTariffs } from './saveTariffs.js';
import { syncGoogleSheets } from './googleSheets.js';
import dotenv from 'dotenv';

dotenv.config();

// обновления тарифов каждый час
export const startFetchTariffsJob = (): void => {
  cron.schedule('0 * * * *', async () => {
    console.log('Крон-задача для загрузки тарифов начала выполнение');
    try {
      const tariffs = await fetchTariffs();
      await saveTariffs(tariffs);
      console.log('Крон-задача для загрузки тарифов завершена успешно');
    } catch (error) {
      console.error('Ошибка при обновлении тарифов:', error);
    }
  });

  console.log('Крон для загрузки тарифов запущен');
};

// cинхронизации с Google Sheets каждый день в полночь
export const startGoogleSheetsJob = (): void => {
  cron.schedule('0 0 * * *', async () => {
    console.log('Крон-задача для синхронизации с Google Sheets начала выполнение');
    try {
      await syncGoogleSheets();
      console.log('Крон-задача для синхронизации с Google Sheets завершена успешно');
    } catch (error) {
      console.error('Ошибка при синхронизации Google Sheets:', error);
    }
  });

  console.log('Крон для Google Sheets запущен');
};
