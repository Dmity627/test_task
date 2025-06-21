import knexLib from 'knex';
import knexConfig from '../config/knex/knexfile.js';
import sleep from '../helpers/sleep.js';
import lodash from 'lodash';
import { Tariff } from '../interfaces/tariff.interface.js';

const { chunk } = lodash;

export const saveTariffs = async (tariffs: Tariff[]): Promise<void> => {
  const knex = knexLib(knexConfig.development);
  try {
    const date = new Date().toISOString().split('T')[0];
    const tariffsWithDate = tariffs.map((tariff) => ({ ...tariff, date }));

    const chunkSize = 100;
    const chunks = chunk(tariffsWithDate, chunkSize);

    for (const chunk of chunks) {
      await knex('tariffs')
        .insert(chunk)
        .onConflict(['date', 'parentID', 'subjectID'])
        .merge();
      await sleep(0);
    }

    console.log(`Записано ${tariffsWithDate.length} тарифов`);
  } catch (error) {
    console.error('Ошибка при сохранении тарифов:', error);
  } finally {
    await knex.destroy();
  }
};
