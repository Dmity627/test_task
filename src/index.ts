import express from 'express';
import dotenv from 'dotenv';
import { startFetchTariffsJob, startGoogleSheetsJob } from './services/cronJobs.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/healthcheck', (req, res) => {
  res.status(200).send('OK');
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);

  startFetchTariffsJob();
  startGoogleSheetsJob();
});
