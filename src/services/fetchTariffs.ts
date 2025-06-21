import axios from 'axios';
import { TARIFFS_API_URL } from '../config/constants.js';

export const fetchTariffs = async () => {
  try {
    const response = await axios.get(TARIFFS_API_URL, {
      headers: {
        Authorization: process.env.AUTH_TOKEN,
      },
    });
    return response.data.report;
  } catch (error) {
    console.error('Ошибка при запросе тарифов:', error);
    return [];
  }
};
